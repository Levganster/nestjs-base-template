import { RoleEnum } from '../../libs/common/src/constants/roles.enum';
import { PrismaClient } from '@prisma/client';

export const seedUser = async (prisma: PrismaClient) => {
  await prisma.user.create({
    data: {
      email: 'string@gmail.com',
      password: '$2a$04$3EuFgtfrKleWTT2lHiioTOfk7d6r0vz.B.Scf4rKGEaJSQ6bfiFBi',
      role: {
        connect: {
          name: RoleEnum.Admin,
        },
      },
      person: {
        create: {
          name: 'Admin',
        },
      },
    },
  });
};
