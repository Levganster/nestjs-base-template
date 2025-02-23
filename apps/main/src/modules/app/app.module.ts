import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import config from '../../config/config';
import { AuthModule } from '../auth/auth.module';
import { LoggerMiddleware } from '@app/common/middlewares/logger.middleware';
import { TokenModule } from '@app/token';
import { UsersModule } from '../users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersModule as LibUsersModule } from '@app/users';
import { PermissionModule as LibPermissionModule } from '@app/permissions';

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
        path: `./libs/i18n/`,
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: configService.get('CACHE_TTL'), // milliseconds
      }),
    }),
    AuthModule,
    TokenModule,
    UsersModule,
    LibUsersModule,
    LibPermissionModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
