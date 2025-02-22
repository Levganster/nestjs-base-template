import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { TokenService } from '@app/token';
import { UsersService } from '@app/users';
import { PasswordService } from '@app/password';
import { User } from '@app/common/types/user';
import { Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
    private readonly i18n: I18nService,
  ) {}

  private async generateTokenPair(userId: string, roleId: string) {
    return {
      accessToken: await this.tokenService.generateAccessToken(userId, roleId),
      refreshToken: await this.tokenService.generateRefreshToken(
        userId,
        roleId,
      ),
    };
  }

  async setTokensCookie(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    await Promise.all(
      Object.entries(tokens).map(([name, token]) =>
        this.setTokenCookie(res, { token, name }),
      ),
    );
  }

  async signUp(dto: SignUpDto) {
    const user = await this.usersService.create(dto);
    this.logger.log(`Пользователь ${dto.email} зарегистрировался`);
    return this.generateTokenPair(user.id, user.roleId);
  }

  async signIn(dto: SignInDto) {
    const user = (await this.usersService.findOneByEmail(dto.email)) as User;
    if (
      !(await this.passwordService.comparePassword({
        password: dto.password,
        hashedPassword: user.password,
      }))
    ) {
      throw new NotFoundException(this.i18n.t('errors.user.notFound'));
    }
    this.logger.log(`Пользователь ${user.email} выполнил вход`);
    return this.generateTokenPair(user.id, user.roleId);
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException(this.i18n.t('errors.user.notFound'));
    }
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    this.logger.log(`Пользователь ${payload.id} получил новый access-token`);
    return this.generateTokenPair(payload.id, payload.roleId);
  }

  private async setTokenCookie(
    res: Response,
    data: { token: string; name: string },
  ) {
    res.cookie(data.name, data.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
}
