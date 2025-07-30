import { BadRequestException, Injectable } from '@nestjs/common';
import { UserCreateDto } from './dto/user-create.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { RoleEnum } from '@app/common/constants/roles.enum';
import { USER_INCLUDE } from '@app/common/types/include/user.include';
import { User } from '@app/common';
import { I18nService } from 'nestjs-i18n';
import { UserUpdateDto } from './dto/user-update.dto';
import { ResetPasswordDto } from 'apps/main/src/modules/auth/dto/password.dto';
import { PasswordService } from '@app/password';
import { mapSort } from '@app/prisma/map.sort';
import { mapSearch } from '@app/prisma/map.search';
import { UserSearchDto } from './dto/user-search.dto';
import { mapPagination } from '@app/prisma/map.pagination';

@Injectable()
export class UsersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly i18n: I18nService,
    private readonly passwordService: PasswordService,
  ) {}

  async findOneById(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id },
      include: USER_INCLUDE,
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { email },
      include: USER_INCLUDE,
    });
  }

  async create(dto: UserCreateDto): Promise<User> {
    const { name, ...rest } = dto;
    return this.prisma.user.create({
      data: {
        ...rest,
        role: {
          connect: {
            name: RoleEnum.Guest,
          },
        },
        person: {
          create: {
            name,
          },
        },
      },
      include: USER_INCLUDE,
    });
  }

  async update(id: string, dto: UserUpdateDto): Promise<User> {
    const { name, avatar, roleId, ...rest } = dto;
    return this.prisma.user.update({
      where: { id },
      data: {
        ...rest,
        person: {
          update: {
            name,
            avatar,
          },
        },
        role: {
          connect: {
            id: roleId,
          },
        },
      },
      include: USER_INCLUDE,
    });
  }

  async createPasswordReset(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prisma.passwordReset.create({
      data: { userId, token, expiresAt },
    });
  }

  async resetPassword(
    token: string,
    dto: ResetPasswordDto,
  ): Promise<{ success: boolean }> {
    const passwordReset = await this.prisma.passwordReset.findFirst({
      where: { token, expiresAt: { gt: new Date() } },
    });
    if (!passwordReset) {
      throw new BadRequestException(
        this.i18n.t('errors.password.invalidToken'),
      );
    }
    const hashedPassword = await this.passwordService.hashPassword(
      dto.password,
    );
    await this.prisma.passwordReset.delete({
      where: { id: passwordReset.id },
    });
    await this.prisma.user.update({
      where: { id: passwordReset.userId },
      data: { password: hashedPassword },
    });
    return { success: true };
  }

  async findOneByPasswordResetToken(token: string): Promise<User | null> {
    const passwordReset = await this.prisma.passwordReset.findFirst({
      where: { token, expiresAt: { gt: new Date() } },
    });
    if (!passwordReset) {
      return null;
    }
    return this.findOneById(passwordReset.userId);
  }

  async createAccountConfirmation(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.ensureExistsAccountConfirmationByUserId(userId);
    await this.prisma.accountConfirmation.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async updateAccountConfirmation(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prisma.accountConfirmation.update({
      where: { userId },
      data: { token, expiresAt },
    });
  }

  async ensureExistsAccountConfirmationByUserId(userId: string): Promise<void> {
    if (await this.existsAccountConfirmationByUserId(userId)) {
      throw new BadRequestException(this.i18n.t('errors.email.alreadyExists'));
    }
  }

  async existsAccountConfirmationByUserId(userId: string): Promise<boolean> {
    const result = await this.prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1
        FROM account_confirmations
        WHERE user_id = ${userId}
      ) as exists
    `;
    return Boolean(result[0].exists);
  }

  async search(dto: UserSearchDto) {
    return this.prisma.user.findMany({
      where: mapSearch(dto.filters),
      orderBy: mapSort(dto.sorts),
      ...mapPagination(dto.pagination),
      include: USER_INCLUDE,
    });
  }

  async count(dto: UserSearchDto) {
    return this.prisma.user.count({
      where: mapSearch(dto.filters),
    });
  }

  async existsById(id: string): Promise<boolean> {
    const result = await this.prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1
        FROM users
        WHERE id = ${id}
      ) as exists
    `;

    return Boolean(result[0].exists);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1
        FROM users
        WHERE email = ${email}
      ) as exists
    `;

    return Boolean(result[0].exists);
  }
}
