import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/common/guards/auth.guard';
import { DecodeUser } from '@app/common/decorators/decode-user.decorator';
import { UsersService } from '@app/users';
import { RemovePasswordInterceptor } from '@app/common/interceptors/password.interceptor';
import { User } from '@app/common';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(RemovePasswordInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@DecodeUser() user: User) {
    return user;
  }
}
