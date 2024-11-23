import { Injectable } from '@nestjs/common';
import { RolePermissionRepository } from './role-permission.repository';
import { UsersService } from '../users/users.service';

@Injectable()
export class RolePermissionService {
  constructor(
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly userService: UsersService,
  ) {}

  async checkPermission(permission: string, userId: string) {
    const userRoleId = await this.getUserRoleId(userId);
    const rolePermissions =
      await this.rolePermissionRepository.findManyByRoleId(userRoleId);

    return rolePermissions.some(
      (rolePermission) => rolePermission.permission.name === permission,
    );
  }

  private async getUserRoleId(userId: string) {
    const user = await this.userService.findOneById(userId);
    return user.role.id;
  }
}
