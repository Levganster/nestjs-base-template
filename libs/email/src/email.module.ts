import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from '@app/prisma/prisma.service';

@Module({
  imports: [ConfigModule],
  providers: [EmailService, PrismaService],
  exports: [EmailService],
})
export class EmailModule {}
