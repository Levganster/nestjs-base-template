import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionService } from '../../modules/permission/permission.service';
import { I18nService } from 'nestjs-i18n';
import { PermissionEnum } from 'src/common/constants/permission.enum';
import { User } from '../types/user';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
    private readonly i18n: I18nService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionEnum[]
    >('permissions', [context.getHandler(), context.getClass()]);
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    const { user }: { user: User } = context.switchToHttp().getRequest();
    const hasAllPermissions = await this.hasPermissions(
      requiredPermissions,
      user.roleId,
    );
    if (!hasAllPermissions) {
      throw new ForbiddenException(this.i18n.t('errors.accessDenied'));
    }
    return true;
  }

  private async hasPermissions(
    requiredPermissions: PermissionEnum[],
    userId: string,
  ): Promise<boolean> {
    const permissionsCheckResults = await Promise.all(
      requiredPermissions.map((permission) =>
        this.permissionService.checkPermission(permission, userId),
      ),
    );
    return permissionsCheckResults.every((result) => result);
  }
}
