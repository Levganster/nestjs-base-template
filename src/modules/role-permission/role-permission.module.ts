import { forwardRef, Module } from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionRepository } from './role-permission.repository';
import { UsersModule } from '../users/users.module';
import { PrismaService } from 'src/common/services/prisma.service';

@Module({
  providers: [RolePermissionService, PrismaService, RolePermissionRepository],
  imports: [forwardRef(() => UsersModule)],
  exports: [RolePermissionService],
})
export class RolePermissionModule {}
