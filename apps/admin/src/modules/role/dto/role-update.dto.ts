import { ApiProperty, PartialType } from '@nestjs/swagger';
import { RoleCreateDto } from './role-create.dto';
import { IsString } from 'class-validator';

export class RoleUpdateDto {
  @ApiProperty()
  @IsString()
  name: string;
}
