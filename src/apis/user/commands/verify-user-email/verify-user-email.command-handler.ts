import { Transactional } from '@nestjs-cls/transactional';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { VerifyUserEmailCommand } from '@src/apis/user/commands/verify-user-email/verify-user-email.command';
import { UserRepositoryPort } from '@src/apis/user/repositories/user.repository-port';
import { USER_REPOSITORY_DI_TOKEN } from '@src/apis/user/tokens/di.token';
import { HttpConflictException } from '@src/libs/exceptions/client-errors/exceptions/http-conflict.exception';
import { HttpNotFoundException } from '@src/libs/exceptions/client-errors/exceptions/http-not-found.exception';
import { HttpUnauthorizedException } from '@src/libs/exceptions/client-errors/exceptions/http-unauthorized.exception';
import { HttpInternalServerErrorException } from '@src/libs/exceptions/server-errors/exceptions/http-internal-server-error.exception';
import { COMMON_ERROR_CODE } from '@src/libs/exceptions/types/errors/common/common-error-code.constant';
import { USER_ERROR_CODE } from '@src/libs/exceptions/types/errors/user/user-error-code.constant';
import { isNil } from '@src/libs/utils/util';

@CommandHandler(VerifyUserEmailCommand)
export class VerifyUserEmailCommandHandler
  implements ICommandHandler<VerifyUserEmailCommand, void>
{
  constructor(
    @Inject(USER_REPOSITORY_DI_TOKEN)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  @Transactional()
  async execute(command: VerifyUserEmailCommand): Promise<void> {
    const { userId, token } = command;

    const existingUser =
      await this.userRepository.findOneUserWithUserEmailVerifyTokenById(userId);

    if (isNil(existingUser)) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    if (existingUser.isEmailVerified) {
      throw new HttpConflictException({
        code: USER_ERROR_CODE.ALREADY_VERIFIED_EMAIL,
      });
    }

    const userEmailVerifyToken = existingUser.userEmailVerifyToken;

    if (isNil(userEmailVerifyToken)) {
      throw new HttpInternalServerErrorException({
        code: COMMON_ERROR_CODE.SERVER_ERROR,
        ctx: '유저의 이메일 인증 토큰이 존재하지 않을 수 없음.',
      });
    }

    if (userEmailVerifyToken.isExpired()) {
      throw new HttpUnauthorizedException({
        code: USER_ERROR_CODE.INVALID_EMAIL_VERIFY_TOKEN,
      });
    }

    if (userEmailVerifyToken.token !== token) {
      throw new UnauthorizedException({
        code: USER_ERROR_CODE.INVALID_EMAIL_VERIFY_TOKEN,
      });
    }

    existingUser.treatEmailAsVerified();

    await this.userRepository.update(existingUser);
  }
}
