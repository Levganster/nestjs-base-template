import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { UsersModule } from '@app/users';

@Module({
  imports: [UsersModule],
  controllers: [TestController],
})
export class TestModule {}
