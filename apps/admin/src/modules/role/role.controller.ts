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
import { HasPermissions } from '@app/common';
import { PermissionEnum } from '@app/common';
import { JwtAuthGuard } from '@app/common';
import { PermissionGuard } from '@app/common';
import { RoleSearchDto } from '@app/role/dto/role-search.dto';
import { RoleService } from '@app/role';
import { RoleCreateDto } from '@app/role/dto/role-create.dto';
import { RoleUpdateDto } from '@app/role/dto/role-update.dto';
import { CanDeleteRoleGuard } from './guards/can-delete.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @HasPermissions(PermissionEnum.RoleCreate)
  async create(@Body() roleDto: RoleCreateDto) {
    return this.roleService.create(roleDto);
  }

  @Post('search')
  @HasPermissions(PermissionEnum.RoleSearch)
  async search(@Body() dto: RoleSearchDto) {
    return this.roleService.search(dto);
  }

  @Get(':id')
  @HasPermissions(PermissionEnum.RoleGet)
  async findOneById(@Param('id') id: string) {
    return this.roleService.findOneById(id);
  }

  @Patch(':id')
  @HasPermissions(PermissionEnum.RoleUpdate)
  async update(@Param('id') id: string, @Body() dto: RoleUpdateDto) {
    return this.roleService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(CanDeleteRoleGuard)
  @HasPermissions(PermissionEnum.RoleDelete)
  async delete(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
