import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from '@app/password';
import { TokenModule } from '@app/token';
import { SessionsModule } from '@app/sessions';
import { PrismaModule } from '@app/prisma/prisma.module';
import { EmailModule } from '@app/email';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
  imports: [TokenModule, SessionsModule, PrismaModule, EmailModule],
  exports: [AuthService],
})
export class AuthModule {}
