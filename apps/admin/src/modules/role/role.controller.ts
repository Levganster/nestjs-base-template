import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { HasPermissions, JwtAuthGuard } from '@app/common';
import { RoleSearchDto } from '@app/role/dto/role-search.dto';
import { RoleService } from '@app/role';
import { RoleCreateDto } from '@app/role/dto/role-create.dto';
import { RoleUpdateDto } from '@app/role/dto/role-update.dto';
import { CanEditRoleGuard } from './guards/can-edit.guard';
import { RoleEnum } from '@app/common/constants/roles.enum';

@ApiBearerAuth()
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HasPermissions(RoleEnum.Admin)
  async create(@Body() roleDto: RoleCreateDto) {
    return this.roleService.create(roleDto);
  }

  @Post('search')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HasPermissions(RoleEnum.Admin)
  async search(@Body() dto: RoleSearchDto) {
    return this.roleService.search(dto);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @HasPermissions(RoleEnum.Admin)
  async findOneById(@Param('id') id: string) {
    return this.roleService.findOneById(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CanEditRoleGuard)
  @HasPermissions(RoleEnum.Admin)
  async update(@Param('id') id: string, @Body() dto: RoleUpdateDto) {
    return this.roleService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, CanEditRoleGuard)
  @HasPermissions(RoleEnum.Admin)
  async delete(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
