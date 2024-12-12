import { ApiProperty, PartialType } from '@nestjs/swagger';
import { RoleBaseDto } from './role-base.dto';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '@app/common';

export class RoleFiltersDto extends PartialType(RoleBaseDto) {}

export class RoleSearchDto {
  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => RoleFiltersDto)
  filters?: RoleFiltersDto;

  @ApiProperty()
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination?: PaginationDto;
}
