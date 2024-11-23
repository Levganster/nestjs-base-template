import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
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

  // create(
  //   roleDto: Prisma.RoleCreateInput,
  //   transactionClient: Prisma.TransactionClient = this.prisma,
  // ) {
  //   return transactionClient.role.create({ data: roleDto });
  // }

  // findById(
  //   uuid: string,
  //   transactionClient: Prisma.TransactionClient = this.prisma,
  // ) {
  //   return transactionClient.role.findUnique({ where: { uuid } });
  // }

  // findByName(
  //   name: string,
  //   transactionClient: Prisma.TransactionClient = this.prisma,
  // ) {
  //   return transactionClient.role.findUnique({ where: { name } });
  // }

  // findAll(transactionClient: Prisma.TransactionClient = this.prisma) {
  //   return transactionClient.role.findMany();
  // }

  // update(
  //   uuid: string,
  //   roleDto: Prisma.RoleUpdateInput,
  //   transactionClient: Prisma.TransactionClient = this.prisma,
  // ) {
  //   return transactionClient.role.update({
  //     where: { uuid },
  //     data: roleDto,
  //   });
  // }

  // delete(
  //   uuid: string,
  //   transactionClient: Prisma.TransactionClient = this.prisma,
  // ) {
  //   return transactionClient.role.delete({ where: { uuid } });
  // }

  // createRolePermissions(
  //   permissions: { roleUuid: string; permissionUuid: string }[],
  //   transactionClient: Prisma.TransactionClient = this.prisma,
  // ) {
  //   return transactionClient.rolePermission.createMany({
  //     data: permissions,
  //   });
  // }

  // deleteRolePermissions(
  //   roleUuid: string,
  //   transactionClient: Prisma.TransactionClient = this.prisma,
  // ) {
  //   return transactionClient.rolePermission.deleteMany({
  //     where: { roleUuid },
  //   });
  // }

  // async existsByName(name: string) {
  //   return !!(await this.findByName(name));
  // }

  // async existsByUuid(uuid: string) {
  //   return !!(await this.findById(uuid));
  // }
}
