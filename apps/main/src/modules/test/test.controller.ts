import { ActiveGuard } from '@app/common/guards/active.guard';
import { JwtAuthGuard } from '@app/common/guards/auth.guard';
import { PermissionGuard } from '@app/common/guards/permission.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('test')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, ActiveGuard, PermissionGuard)
export class TestController {
  @Get()
  async getHello() {
    return 'hello';
  }
}
