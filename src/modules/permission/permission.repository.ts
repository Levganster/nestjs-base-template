import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class PermissionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.permission.findMany();
  }

  async findOneById(id: string) {
    return this.prisma.permission.findUnique({ where: { id } });
  }

  async existsById(id: string): Promise<boolean> {
    return !!(await this.prisma.permission.findUnique({
      where: { id },
      select: { id: true },
    }));
  }

  async existsMany(uuids: string[]): Promise<boolean> {
    const permissionExistsResults = await Promise.all(
      uuids.map((uuid) => this.existsById(uuid)),
    );
    return permissionExistsResults.every((exists) => exists);
  }
}
