import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PermissionBaseDto } from './permission-base.dto';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '@app/common';

export class PermissionFiltersDto extends PartialType(PermissionBaseDto) {}

export class PermissionSearchDto {
  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PermissionFiltersDto)
  filters?: PermissionFiltersDto;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination?: PaginationDto;
}
