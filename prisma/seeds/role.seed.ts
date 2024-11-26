import { PrismaClient } from '@prisma/client';
import { PermissionEnum } from '@app/common';

export async function seedRole(prisma: PrismaClient) {
  await createAdmin(prisma);
  await createUser(prisma);
}

async function createAdmin(prisma: PrismaClient, role: string = 'admin') {
  await prisma.$transaction(async (prisma) => {
    const createdRole = await prisma.role.create({
      data: { name: role },
    });
    const permissions = await prisma.permission.findMany();
    const rolePermissions = permissions.map((permission) => ({
      roleId: createdRole.id,
      permissionId: permission.id,
    }));
    await prisma.rolePermission.createMany({
      data: rolePermissions,
    });
  });
}

async function createUser(prisma: PrismaClient) {
  await prisma.$transaction(async (prisma) => {
    const createdRole = await prisma.role.create({
      data: { name: 'user' },
    });
    const userPermissions = [PermissionEnum.UserCreate, PermissionEnum.UserGet];
    const permissions = await prisma.permission.findMany({
      where: {
        name: { in: userPermissions },
      },
    });
    await prisma.rolePermission.createMany({
      data: permissions.map((permission) => ({
        roleId: createdRole.id,
        permissionId: permission.id,
      })),
    });
  });
}
