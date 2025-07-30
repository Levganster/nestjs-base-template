import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UserBaseDto } from './user-base.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UserUpdateDto extends PartialType(UserBaseDto) {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  roleId?: string;
}
