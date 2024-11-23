import { ApiProperty } from '@nestjs/swagger';
import { UserBaseDto } from 'src/modules/users/dto/user-base.dto';

export class SignInDto extends UserBaseDto {}
