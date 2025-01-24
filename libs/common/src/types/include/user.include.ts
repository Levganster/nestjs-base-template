import { Prisma } from '@prisma/client';

export const USER_INCLUDE: Prisma.UserInclude = {
	role: true,
}