import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { I18nModule } from 'nestjs-i18n';
import { AcceptLanguageResolver } from 'nestjs-i18n';
import config from '../../config/config';
import { TokenModule } from '@app/token';
import { RoleModule } from '@app/role';
import { RoleModule as LibRoleModule } from '../role/role.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UsersModule } from '../users/users.module';
import { UsersModule as LibUsersModule } from '@app/users';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, PermissionGuard } from '@app/common';

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
    TokenModule,
    RoleModule,
    LibRoleModule,
    UsersModule,
    LibUsersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
