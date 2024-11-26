import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshDto } from './dto/refresh.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthSummary } from '../../common/swagger/summary/auth.summary';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: AuthSummary.SIGN_UP })
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  @ApiOperation({ summary: AuthSummary.SIGN_IN })
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @Post('refresh')
  @ApiOperation({ summary: AuthSummary.REFRESH })
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }
}
