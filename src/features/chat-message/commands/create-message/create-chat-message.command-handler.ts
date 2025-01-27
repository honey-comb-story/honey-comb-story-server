import { CreateChatMessageCommand } from '@features/chat-message/commands/create-message/create-chat-message.command';
import { CHAT_MESSAGE_REPOSITORY_DI_TOKEN } from '@features/chat-message/tokens/di.token';
import { ChatRoomRepositoryPort } from '@features/chat-room/repositories/chat-room.repository-port';
import { UserConnectionRepositoryPort } from '@features/user/user-connection/repositories/user-connection.repository-port';
import { USER_CONNECTION_REPOSITORY_DI_TOKEN } from '@features/user/user-connection/tokens/di.token';
import { UserConnectionStatus } from '@features/user/user-connection/types/user.constant';
import { HttpForbiddenException } from '@libs/exceptions/client-errors/exceptions/http-forbidden.exception';
import { HttpNotFoundException } from '@libs/exceptions/client-errors/exceptions/http-not-found.exception';
import { COMMON_ERROR_CODE } from '@libs/exceptions/types/errors/common/common-error-code.constant';
import { isNil } from '@libs/utils/util';
import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateChatMessageCommand)
export class CreateChatMessageCommandHandler
  implements ICommandHandler<CreateChatMessageCommand, void>
{
  constructor(
    @Inject(CHAT_MESSAGE_REPOSITORY_DI_TOKEN)
    private readonly chatRoomRepository: ChatRoomRepositoryPort,
    @Inject(USER_CONNECTION_REPOSITORY_DI_TOKEN)
    private readonly userConnectionRepository: UserConnectionRepositoryPort,
  ) {}

  async execute(command: CreateChatMessageCommand): Promise<void> {
    const { roomId, userId, message } = command;

    const chatRoom = await this.chatRoomRepository.findOneById(roomId);

    if (isNil(chatRoom)) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    const connection =
      await this.userConnectionRepository.findOneByUserIdAndStatus(
        userId,
        UserConnectionStatus.ACCEPTED,
      );

    if (isNil(connection)) {
      throw new HttpNotFoundException({
        code: COMMON_ERROR_CODE.RESOURCE_NOT_FOUND,
      });
    }

    if (chatRoom.getProps().connectionId !== connection.getProps().id) {
      throw new HttpForbiddenException({
        code: COMMON_ERROR_CODE.PERMISSION_DENIED,
      });
    }

    const chatMessage = chatRoom.createChatMessage({
      roomId,
      senderId: userId,
      message,
    });

    await this.chatRoomRepository.createChatMessage(chatMessage);
  }
}
