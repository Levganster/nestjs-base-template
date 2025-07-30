import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { I18nService } from 'nestjs-i18n';
import { JwtPayload } from '../types/jwt-payload';
import { RoleService } from '@app/role';
import { Role } from '@prisma/client';
import { RoleEnum } from '../constants/roles.enum';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly i18n: I18nService,
    private readonly roleService: RoleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.getRequiredRole(context);

    if (this.shouldSkipRoleCheck(requiredRoles)) {
      return true;
    }

    const payload = this.extractUserPayload(context);
    const role = await this.roleService.findOneById(payload.roleId);

    await this.validateRole(role, requiredRoles);

    return true;
  }

  private getRequiredRole(context: ExecutionContext): RoleEnum[] {
    return this.reflector.getAllAndOverride<RoleEnum[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private shouldSkipRoleCheck(roles: RoleEnum[]): boolean {
    return !roles || roles.length === 0;
  }

  private extractUserPayload(context: ExecutionContext): JwtPayload {
    const { user } = context.switchToHttp().getRequest();
    return user;
  }

  private async validateRole(
    userRole: Role,
    requiredRoles: RoleEnum[],
  ): Promise<void> {
    const hasRole = requiredRoles.includes(userRole.name as RoleEnum);

    if (!hasRole) {
      throw new ForbiddenException(this.i18n.t('errors.accessDenied'));
    }
  }
}
