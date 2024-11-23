import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { PasswordService } from '../password/password.service';
import { TokenModule } from '../token/token.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PasswordService],
  imports: [forwardRef(() => UsersModule), TokenModule],
  exports: [AuthService],
})
export class AuthModule {}
