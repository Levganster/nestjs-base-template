import { PrismaClient } from '@prisma/client';
import { RoleEnum } from '../../libs/common/src/constants/roles.enum';

export async function seedRole(prisma: PrismaClient) {
  await createRole(prisma, RoleEnum.Admin);
  await createRole(prisma, RoleEnum.User);
  await createRole(prisma, RoleEnum.Guest);
}

async function createRole(prisma: PrismaClient, roleName: string) {
  await prisma.$transaction(async (prisma) => {
    await prisma.role.create({
      data: { name: roleName },
    });
  });
}
