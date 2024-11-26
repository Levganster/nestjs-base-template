import { PermissionModule } from '@app/permissions';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { I18nModule } from 'nestjs-i18n';
import { AcceptLanguageResolver } from 'nestjs-i18n';
import config from '../../config/config';
import { TokenModule } from '@app/token';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        'ru-*': 'ru',
        'en-*': 'en',
      },
      loaderOptions: {
        path: `./dist/i18n/`,
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    PermissionModule,
    TokenModule,
  ],
})
export class AppModule {}
