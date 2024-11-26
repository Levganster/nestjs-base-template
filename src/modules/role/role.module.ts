import { forwardRef, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PermissionModule } from '../permission/permission.module';
import { RoleRepository } from './role.repository';
import { PrismaService } from 'src/common/services/prisma.service';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [RoleController],
  providers: [RoleService, PrismaService, RoleRepository],
  exports: [RoleService],
  imports: [PermissionModule, forwardRef(() => UsersModule)],
})
export class RoleModule {}
