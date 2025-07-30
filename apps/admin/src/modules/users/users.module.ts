import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersModule as LibUsersModule } from '@app/users';

@Module({
  controllers: [UsersController],
  providers: [],
  imports: [LibUsersModule],
})
export class UsersModule {}
