import {
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UserCreateDto } from './dto/user-create.dto';
import { I18nService } from 'nestjs-i18n';
import { PasswordService } from '@app/password';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { User } from '@app/common';
import { UserUpdateDto } from './dto/user-update.dto';
import { ResetPasswordDto } from 'apps/main/src/modules/auth/dto/password.dto';
import { UserSearchDto } from './dto/user-search.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
    private readonly i18n: I18nService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(dto: UserCreateDto): Promise<User> {
    await this.ensureExistsByEmail(dto.email);
    const hashedPassword = await this.passwordService.hashPassword(
      dto.password,
    );
    return await this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });
  }

  async update(id: string, dto: UserUpdateDto): Promise<User> {
    return await this.usersRepository.update(id, dto);
  }

  async createPasswordReset(userId: string, token: string): Promise<void> {
    return await this.usersRepository.createPasswordReset(
      userId,
      token,
      new Date(Date.now() + 1000 * 60 * 60 * 24),
    );
  }

  async resetPassword(
    token: string,
    dto: ResetPasswordDto,
  ): Promise<{ success: boolean }> {
    return await this.usersRepository.resetPassword(token, dto);
  }

  async findOneByPasswordResetToken(token: string): Promise<User | null> {
    return await this.usersRepository.findOneByPasswordResetToken(token);
  }

  async createAccountConfirmation(email: string, token: string): Promise<void> {
    return await this.usersRepository.createAccountConfirmation(
      email,
      token,
      new Date(Date.now() + 1000 * 60 * 60 * 24),
    );
  }

  async updateAccountConfirmation(email: string, token: string): Promise<void> {
    return await this.usersRepository.updateAccountConfirmation(
      email,
      token,
      new Date(Date.now() + 1000 * 60 * 60 * 24),
    );
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(this.i18n.t('errors.user.notFound'));
    }
    return user;
  }

  async findOneById(id: string): Promise<User> {
    const cachedUser = await this.cacheManager.get<User>(`user:${id}`);
    if (cachedUser) {
      this.logger.log(`User ${id} found in cache`);
      return cachedUser;
    }

    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      this.logger.warn(`User ${id} not found`);
      throw new NotFoundException(this.i18n.t('errors.user.notFound'));
    }

    this.logger.log(`User ${id} found in db, setting to cache`);
    await this.cacheManager.set(`user:${id}`, user, 1000 * 60);
    return user;
  }

  async search(dto: UserSearchDto) {
    const users = await this.usersRepository.search(dto);
    const count = await this.usersRepository.count(dto);
    return { users, count };
  }

  async count(dto: UserSearchDto) {
    return await this.usersRepository.count(dto);
  }

  async ensureExistsById(id: string): Promise<void> {
    const exists = await this.usersRepository.existsById(id);
    if (!exists) {
      throw new NotFoundException(this.i18n.t('errors.user.notFound'));
    }
  }

  async ensureExistsByEmail(email: string): Promise<void> {
    const exists = await this.usersRepository.existsByEmail(email);
    if (exists) {
      throw new ConflictException(
        this.i18n.translate('errors.user.alreadyExists'),
      );
    }
  }
}
