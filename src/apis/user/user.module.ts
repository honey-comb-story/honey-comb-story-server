import { Module } from '@nestjs/common';
import { Provider } from '@nestjs/common/interfaces';
import { CreateUserCommandHandler } from '@src/apis/user/commands/create-user/create-user.command-handler';
import { UserController } from '@src/apis/user/controllers/user.controller';
import { UserMapper } from '@src/apis/user/mappers/user.mapper';
import { UserRepository } from '@src/apis/user/repositories/user.repository';
import { USER_REPOSITORY_DI_TOKEN } from '@src/apis/user/tokens/di.token';
import { CreateUserEmailVerifyTokenDomainEventHandler } from '@src/apis/user/application/event-handlers/create-user-email-verify-token.domain-event-handler';
import { EmailModule } from '@src/libs/email/email.module';
import { VerifyUserEmailCommandHandler } from '@src/apis/user/commands/verify-user-email/verify-user-email.command-handler';
import { SendVerificationEmailCommandHandler } from '@src/apis/user/commands/send-verification-email/send-verification-email.command-handler';
import { UserVerifyTokenMapper } from '@src/apis/user/mappers/user-verify-token.mapper';
import { UpdateUserPasswordCommandHandler } from '@src/apis/user/commands/update-user-password/update-user-password.command-handler';
import { SendPasswordChangeVerificationEmailCommandHandler } from '@src/apis/user/commands/send-password-change-verification-email/send-password-change-verification-email.command-handler';
import { UserConnectionController } from '@src/apis/user/controllers/user-connection/user-connection.controller';
import { CreateUserConnectionCommandHandler } from '@src/apis/user/commands/user-connection/create-user-connection/create-user-connection.command-handler';
import { UserConnectionMapper } from '@src/apis/user/mappers/user-connection.mapper';
import { FindUsersQueryHandler } from '@src/apis/user/queries/find-users/find-users.query';

const controllers = [UserController, UserConnectionController];

const commandHandlers: Provider[] = [
  CreateUserCommandHandler,
  VerifyUserEmailCommandHandler,
  SendVerificationEmailCommandHandler,
  SendPasswordChangeVerificationEmailCommandHandler,
  UpdateUserPasswordCommandHandler,
  CreateUserConnectionCommandHandler,
];

const queryHandlers: Provider[] = [FindUsersQueryHandler];

const eventHandlers: Provider[] = [
  CreateUserEmailVerifyTokenDomainEventHandler,
];

const repositories: Provider[] = [
  { provide: USER_REPOSITORY_DI_TOKEN, useClass: UserRepository },
];

const mappers: Provider[] = [
  UserMapper,
  UserConnectionMapper,
  UserVerifyTokenMapper,
];

@Module({
  imports: [EmailModule],
  controllers: [...controllers],
  providers: [
    ...mappers,
    ...repositories,
    ...commandHandlers,
    ...queryHandlers,
    ...eventHandlers,
  ],
  exports: [...repositories, ...mappers],
})
export class UserModule {}
