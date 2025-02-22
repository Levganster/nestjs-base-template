import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@app/common/guards/auth.guard';
import { DecodePayload } from '@app/common/decorators/decode-payload.decorator';
import { UserWithoutPassword } from '@app/common/types/user';
import { UsersService } from '@app/users';
import { RemovePasswordInterceptor } from '@app/common/interceptors/password.interceptor';
import { JwtPayload } from '@app/common';

@Controller('users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(RemovePasswordInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async me(@DecodePayload() payload: JwtPayload) {
    return this.usersService.findOneById(payload.id);
  }
}
