import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@app/prisma/prisma.service';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/send-email.dto';
import { I18nService } from 'nestjs-i18n';
import { RoleEnum } from '@app/common';
import * as crypto from 'crypto';
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
  ) {}

  private async initializeTransporter() {
    if (!this.transporter) {
      this.transporter = nodemailer.createTransport({
        service: this.configService.getOrThrow<string>('SMTP_SERVICE'),
        host: this.configService.getOrThrow<string>('SMTP_HOST'),
        port: this.configService.getOrThrow<number>('SMTP_PORT'),
        secure: true,
        auth: {
          user: this.configService.getOrThrow<string>('SMTP_USER'),
          pass: this.configService.getOrThrow<string>('SMTP_PASSWORD'),
        },
      });
    }
  }

  async sendEmail(
    dto: SendEmailDto,
  ): Promise<{ messageId: string; preview: string }> {
    await this.initializeTransporter();

    try {
      const info = await this.transporter.sendMail({
        from: this.configService.getOrThrow<string>('SMTP_FROM'),
        to: dto.to,
        subject: dto.subject,
        text: dto.text,
        html: dto.html,
      });

      return {
        messageId: info.messageId,
        preview: info.preview || `Письмо "${dto.subject}" отправлено`,
      };
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendForgotPasswordEmail(
    email: string,
    token: string,
  ): Promise<{ messageId: string; preview: string }> {
    const forgotPasswordLink = `${this.configService.getOrThrow<string>('FRONTEND_URL')}/auth/password/reset/${token}`;

    return await this.sendEmail({
      to: email,
      subject: 'Сброс пароля',
      text: `Перейдите по ссылке для сброса пароля: ${forgotPasswordLink}`,
      html: `<p>Перейдите по ссылке для сброса пароля: <a href="${forgotPasswordLink}">${forgotPasswordLink}</a></p>`,
    });
  }

  async sendVerificationEmail(
    email: string,
    token: string,
  ): Promise<{ messageId: string; preview: string }> {
    const verificationLink = `${this.configService.getOrThrow<string>('FRONTEND_URL')}/email-verify/${token}`;

    return await this.sendEmail({
      to: email,
      subject: 'Подтверждение регистрации аккаунта',
      text: `Перейдите по ссылке для подтверждения регистрации: ${verificationLink}`,
      html: `<p>Перейдите по ссылке для подтверждения регистрации: <a href="${verificationLink}">${verificationLink}</a></p>`,
    });
  }
}
