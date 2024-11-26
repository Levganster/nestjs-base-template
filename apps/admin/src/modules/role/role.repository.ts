import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common/services/prisma.service';
import { RoleCreateDto } from './dto/role-create.dto';
import { RoleUpdateDto } from './dto/role-update.dto';

@Injectable()
export class RoleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async delete(id: string) {
    return this.prisma.role.delete({ where: { id } });
  }

  async create(dto: RoleCreateDto) {
    return this.prisma.role.create({
      data: {
        name: dto.name,
        rolePermissions: {
          createMany: {
            data: dto.permissions.map((permission) => ({
              permissionId: permission,
            })),
          },
        },
      },
    });
  }

  async update(id: string, dto: RoleUpdateDto) {
    return this.prisma.role.update({
      where: { id },
      data: dto,
    });
  }

  async findOneById(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return this.prisma.role.findMany();
  }

  async existsById(id: string) {
    return !!(await this.prisma.role.findFirst({
      where: { id },
      select: { id: true },
    }));
  }
}
