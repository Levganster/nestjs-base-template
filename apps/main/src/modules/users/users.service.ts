import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { BaseUser } from '@app/common';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async updateAvatar(id: string, avatar: string): Promise<BaseUser> {
    return this.repository.updateAvatar(id, avatar);
  }
}
