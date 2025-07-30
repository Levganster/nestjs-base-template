import { Prisma } from '@prisma/client';

export const USER_INCLUDE = {
  role: true,
  person: true,
} satisfies Prisma.UserInclude;
