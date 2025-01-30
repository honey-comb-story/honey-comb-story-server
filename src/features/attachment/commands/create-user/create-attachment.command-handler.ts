import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Transactional } from '@nestjs-cls/transactional';
import { APP_CONFIG_SERVICE_DI_TOKEN } from '@libs/core/app-config/tokens/app-config.di-token';
import { AppConfigServicePort } from '@libs/core/app-config/services/app-config.service-port';
import { Key } from '@libs/core/app-config/types/app-config.type';
import { CreateAttachmentsCommand } from '@features/attachment/commands/create-user/create-attachment.command';
import { AttachmentRepositoryPort } from '@features/attachment/repositories/attachment.repository-port';
import { ATTACHMENT_REPOSITORY_DI_TOKEN } from '@features/attachment/tokens/di.token';
import { AttachmentEntity } from '@features/attachment/domain/attachment.entity';
import { getTsid } from 'tsid-ts';
import { ENV_KEY } from '@libs/core/app-config/constants/app-config.constant';
import { S3_SERVICE_TOKEN } from '@libs/s3/tokens/di.token';
import { S3ServicePort } from '@libs/s3/services/s3.service-port';
import { HttpInternalServerErrorException } from '@libs/exceptions/server-errors/exceptions/http-internal-server-error.exception';
import { COMMON_ERROR_CODE } from '@libs/exceptions/types/errors/common/common-error-code.constant';

@CommandHandler(CreateAttachmentsCommand)
export class CreateAttachmentsCommandHandler
  implements ICommandHandler<CreateAttachmentsCommand, string[]>
{
  constructor(
    @Inject(ATTACHMENT_REPOSITORY_DI_TOKEN)
    private readonly attachmentRepository: AttachmentRepositoryPort,
    @Inject(APP_CONFIG_SERVICE_DI_TOKEN)
    private readonly appConfigService: AppConfigServicePort<Key>,
    @Inject(S3_SERVICE_TOKEN)
    private readonly s3Service: S3ServicePort,
  ) {}

  @Transactional()
  async execute(command: CreateAttachmentsCommand): Promise<string[]> {
    const { files } = command;

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const id = getTsid().toBigInt();
        const path =
          this.appConfigService.get<string>(ENV_KEY.AWS_S3_ATTACHMENT_PATH) +
          id;

        const url = await this.s3Service.uploadFileToS3(
          {
            buffer: file.buffer,
            mimetype: file.mimeType,
          },
          path,
        );

        return {
          id,
          userId: file.userId,
          path,
          url,
          mimeType: file.mimeType,
          capacity: BigInt(file.capacity),
          uploadType: file.uploadType,
        };
      }),
    );

    try {
      const attachments = uploadedFiles.map((file) =>
        AttachmentEntity.create(file),
      );

      await this.attachmentRepository.bulkCreate(attachments);

      return attachments.map((attachment) => attachment.url);
    } catch (err: any) {
      await this.s3Service.deleteFilesFromS3(
        uploadedFiles.map((file) => file.path),
      );

      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: 'Failed files upload',
        stack: err.stack,
      });
    }
  }
}
