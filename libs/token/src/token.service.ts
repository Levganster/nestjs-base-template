import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '@app/common/types/jwt-payload';
import * as crypto from 'crypto';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(
    id: string,
    jti?: string,
  ): Promise<{ token: string; jti: string }> {
    const tokenJti = jti || crypto.randomUUID();
    this.logger.log(`Генерация токена доступа для пользователя с ID: ${id}`);
    const token = this.jwtService.sign({ id, jti: tokenJti });
    return { token, jti: tokenJti };
  }

  async generateRefreshToken(
    id: string,
    jti?: string,
  ): Promise<{ token: string; jti: string }> {
    const tokenJti = jti || crypto.randomUUID();
    this.logger.log(`Генерация токена обновления для пользователя с ID: ${id}`);
    const token = this.jwtService.sign(
      { id, jti: tokenJti },
      {
        secret: this.configService.get('REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );
    return { token, jti: tokenJti };
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    try {
      this.logger.log(`Проверка токена обновления: ${token}`);
      return this.jwtService.verify(token, {
        secret: this.configService.get('REFRESH_SECRET'),
      });
    } catch (error) {
      this.logger.warn(`Ошибка проверки токена обновления: ${error.message}`);
      throw new UnauthorizedException();
    }
  }
}
