import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { TokenService } from '@app/token';
import { UsersService } from '@app/users';
import { PasswordService } from '@app/password';
import { Response } from 'express';
import { SessionsService } from '@app/sessions';
import { PrismaService } from '@app/prisma/prisma.service';
import { EmailService } from '@app/email';
import * as crypto from 'crypto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password.dto';
import { RoleEnum } from '@app/common/constants/roles.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly passwordService: PasswordService,
    private readonly i18n: I18nService,
    private readonly sessionsService: SessionsService,
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  private async generateTokenPair(userId: string) {
    const accessTokenData = await this.tokenService.generateAccessToken(userId);
    const refreshTokenData = await this.tokenService.generateRefreshToken(
      userId,
      accessTokenData.jti,
    );

    return {
      accessToken: accessTokenData.token,
      refreshToken: refreshTokenData.token,
      jti: accessTokenData.jti,
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

    const token = crypto.randomUUID();
    await this.usersService.createAccountConfirmation(user.id, token);
    await this.emailService.sendVerificationEmail(dto.email, token);

    const tokens = await this.generateTokenPair(user.id);
    await this.sessionsService.create(user.id, tokens.refreshToken, tokens.jti);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async signIn(dto: SignInDto) {
    const user = await this.usersService.findOneByEmail(dto.email);

    if (
      !(await this.passwordService.comparePassword({
        password: dto.password,
        hashedPassword: user.password,
      }))
    ) {
      this.logger.warn(`Неудачная попытка входа для ${dto.email}`);
      throw new UnauthorizedException(this.i18n.t('errors.unauthorized'));
    }

    const tokens = await this.generateTokenPair(user.id);
    await this.sessionsService.create(user.id, tokens.refreshToken, tokens.jti);

    this.logger.log(`Пользователь ${dto.email} успешно вошел в систему`);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findOneByEmail(dto.email);
    const token = crypto.randomUUID();
    await this.usersService.createPasswordReset(user.id, token);
    await this.emailService.sendForgotPasswordEmail(user.email, token);
    return { success: true };
  }

  async resetPassword(token: string, dto: ResetPasswordDto) {
    const user = await this.usersService.findOneByPasswordResetToken(token);
    if (!user) {
      throw new BadRequestException(
        this.i18n.t('errors.password.invalidToken'),
      );
    }
    await this.usersService.resetPassword(token, dto);
    await this.sessionsService.deleteAllUserSessions(user.id);
    return { success: true };
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException(this.i18n.t('errors.unauthorized'));
    }

    const payload = await this.tokenService.verifyRefreshToken(refreshToken);

    await this.sessionsService.deleteSession(refreshToken);

    const tokens = await this.generateTokenPair(payload.id);
    await this.sessionsService.create(
      payload.id,
      tokens.refreshToken,
      tokens.jti,
    );

    this.logger.log(`Обновлен токен для пользователя ${payload.id}`);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async signOut(refreshToken: string, fullLogout: boolean = false) {
    if (!refreshToken) {
      throw new UnauthorizedException(this.i18n.t('errors.unauthorized'));
    }

    const session = await this.sessionsService.validateSession(refreshToken);

    if (fullLogout) {
      await this.sessionsService.deleteAllUserSessions(session.userId);
      this.logger.log(`Пользователь ${session.userId} вышел из всех сессий`);
    } else {
      await this.sessionsService.deleteSession(refreshToken);
      this.logger.log(`Пользователь ${session.userId} вышел из текущей сессии`);
    }
  }

  async verifyEmail(
    token: string,
  ): Promise<{ success: boolean; userId?: string }> {
    const currentDate = new Date();

    const verification = await this.prisma.accountConfirmation.findFirst({
      where: {
        token,
        expiresAt: { gt: currentDate },
      },
    });

    if (!verification) {
      throw new BadRequestException(this.i18n.t('errors.email.invalidToken'));
    }

    await this.prisma.accountConfirmation.delete({
      where: { id: verification.id },
    });

    const user = await this.usersService.findOneById(verification.userId);
    const role = await this.prisma.role.findFirst({
      where: {
        name: RoleEnum.User,
      },
    });
    await this.usersService.update(user.id, {
      roleId: role.id,
    });

    return { success: true };
  }

  async resendVerificationEmail(userId: string) {
    const user = await this.usersService.findOneById(userId);
    if (user.role.name === RoleEnum.User) {
      throw new BadRequestException(
        this.i18n.t('errors.email.alreadyVerified'),
      );
    }
    const token = crypto.randomUUID();
    await this.usersService.updateAccountConfirmation(user.id, token);
    await this.emailService.sendVerificationEmail(user.email, token);
    return { success: true };
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
