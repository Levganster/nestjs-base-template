import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class RolePermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findManyByRoleId(roleId: string) {
    return this.prisma.rolePermission.findMany({
      where: { roleId },
      select: { permission: true },
    });
  }
}
