import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../constants/roles.enum';

export const HasPermissions = (...roles: RoleEnum[]) =>
  SetMetadata('roles', roles);
