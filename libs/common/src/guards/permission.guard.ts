import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { User } from '../types/user';
import { PermissionEnum } from '../constants/permission.enum';
import { PermissionService } from 'libs/permissions/src';
import { PERMISSION_SERVICE } from '../constants/providers.const';
import { JwtPayload } from '../types/jwt-payload';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(PERMISSION_SERVICE)
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
    const { payload }: { payload: JwtPayload } = context
      .switchToHttp()
      .getRequest();
    const permissions = await this.permissionService.findManyByRoleId(
      payload.roleId,
    );
    const hasAllPermissions = requiredPermissions.every((permission) =>
      permissions.some((p) => p.name === permission),
    );
    if (!hasAllPermissions) {
      throw new ForbiddenException(this.i18n.t('errors.accessDenied'));
    }
    return true;
  }
}
