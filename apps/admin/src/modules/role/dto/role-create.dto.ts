import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { IsString } from 'class-validator';

export class RoleCreateDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  permissions: string[];
}
