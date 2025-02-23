import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { PermissionModule } from '@app/permissions';
import { RoleModule as LibRoleModule } from '@app/role';

@Module({
  controllers: [RoleController],
  providers: [],
  imports: [PermissionModule, LibRoleModule],
})
export class RoleModule {}
