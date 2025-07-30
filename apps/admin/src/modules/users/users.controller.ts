import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from '@app/users';
import { UserSearchDto } from '@app/users/dto/user-search.dto';
import { HasPermissions, JwtAuthGuard, RoleEnum } from '@app/common';
import { UserUpdateDto } from '@app/users/dto/user-update.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@HasPermissions(RoleEnum.Admin)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('search')
  async search(@Body() dto: UserSearchDto) {
    return this.usersService.search(dto);
  }

  @Patch(':id')
  async update(@Body() dto: UserUpdateDto, @Param('id') id: string) {
    return this.usersService.update(id, dto);
  }
}
