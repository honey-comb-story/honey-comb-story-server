import { Global, Inject, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as Joi from 'joi';

import { ENV_KEY } from '@src/libs/core/app-config/constants/app-config.constant';
import { AppConfigService } from '@src/libs/core/app-config/services/app-config.service';
import { APP_CONFIG_SERVICE_DI_TOKEN } from '@src/libs/core/app-config/tokens/app-config.di-token';
import { Key } from '@src/libs/core/app-config/types/app-config.type';
import { AppConfigServicePort } from '@src/libs/core/app-config/services/app-config.service-port';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      validationSchema: Joi.object({
        [ENV_KEY.PORT]: Joi.number().default(3000),
        [ENV_KEY.NODE_ENV]: Joi.string().required(),
        /**
         * @todo dns 적용하면 default 제거 및 required 로 변경
         */
        [ENV_KEY.DOMAIN]: Joi.string().default('http://localhost:3000'),

        [ENV_KEY.HASH_ROUND]: Joi.number().required(),

        [ENV_KEY.JWT_SECRET]: Joi.string().required(),

        [ENV_KEY.DATABASE_URL]: Joi.string().required(),

        [ENV_KEY.EMAIL_SERVICE]: Joi.string().required(),
        [ENV_KEY.EMAIL_AUTH_USER]: Joi.string().required(),
        [ENV_KEY.EMAIL_AUTH_PASSWORD]: Joi.string().required(),
      }),
    }),
  ],
  providers: [
    ConfigService,
    { provide: APP_CONFIG_SERVICE_DI_TOKEN, useClass: AppConfigService },
  ],
  exports: [APP_CONFIG_SERVICE_DI_TOKEN],
})
export class AppConfigModule implements OnApplicationBootstrap {
  constructor(
    @Inject(APP_CONFIG_SERVICE_DI_TOKEN)
    private readonly appConfigService: AppConfigServicePort<Key>,
  ) {}

  onApplicationBootstrap() {
    console.info(this.appConfigService.getAllMap());
  }
}
