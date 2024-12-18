import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { PasswordModule } from '@app/password';
import { PrismaService } from '@app/common/services/prisma.service';

@Module({
  imports: [PasswordModule],
  providers: [UsersService, UsersRepository, PrismaService],
  exports: [UsersService],
})
export class UsersModule {}
