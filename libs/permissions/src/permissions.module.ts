import { forwardRef, Module } from '@nestjs/common';
import { PermissionService } from './permissions.service';
import { PermissionController } from './permissions.controller';
import { PermissionRepository } from './permissions.repository';
import { UsersModule } from '@app/users';
import { PrismaService } from '@app/common/services/prisma.service';
import { PermissionGuard } from '@app/common';
import { PERMISSION_SERVICE } from '@app/common/constants/providers.const';

@Module({
  controllers: [PermissionController],
  providers: [
    {
      provide: PERMISSION_SERVICE,
      useClass: PermissionService,
    },
    PrismaService,
    PermissionRepository,
  ],
  exports: [PERMISSION_SERVICE],
  imports: [UsersModule],
})
export class PermissionModule {}
