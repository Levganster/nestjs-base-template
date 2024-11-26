import { forwardRef, Module } from '@nestjs/common';
import { PermissionService } from './permissions.service';
import { PermissionController } from './permissions.controller';
import { PermissionRepository } from './permissions.repository';
import { UsersModule } from '@app/users';
import { PrismaService } from '@app/common/services/prisma.service';

@Module({
  controllers: [PermissionController],
  providers: [PermissionService, PrismaService, PermissionRepository],
  exports: [PermissionService],
  imports: [forwardRef(() => UsersModule)],
})
export class PermissionModule {}
