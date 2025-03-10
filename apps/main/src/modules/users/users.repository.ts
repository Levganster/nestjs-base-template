import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async updateAvatar(id: string, avatarId: string) {
    return this.prisma.user.update({
      where: { id },
      data: { avatarId },
    });
  }
}
