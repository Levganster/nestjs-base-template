import { forwardRef, Module } from '@nestjs/common';
import { PermissionService } from './permissions.service';
import { PermissionController } from './permissions.controller';
import { PermissionRepository } from './permissions.repository';
import { UsersModule } from '@app/users';
import { PrismaService } from '@app/common/services/prisma.service';
import { PermissionGuard } from '@app/common';

@Module({
  controllers: [PermissionController],
  providers: [
    {
      provide: 'PermissionService',
      useClass: PermissionService,
    },
    PrismaService,
    PermissionRepository,
  ],
  exports: ['PermissionService'],
  imports: [UsersModule],
})
export class PermissionModule {}
``;
