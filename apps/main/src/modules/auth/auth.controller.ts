import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  Req,
  Query,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DecodeUser, JwtAuthGuard, User } from '@app/common';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() dto: SignInDto, @Res() res: Response) {
    const tokens = await this.authService.signIn(dto);
    await this.authService.setTokensCookie(res, tokens);
    return res.json(tokens);
  }

  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto, @Res() res: Response) {
    const tokens = await this.authService.signUp(dto);
    await this.authService.setTokensCookie(res, tokens);
    return res.json(tokens);
  }

  @Post('sign-up/confirm/:token')
  async confirmSignUp(@Param('token') token: string) {
    return await this.authService.verifyEmail(token);
  }

  @Post('sign-up/resend-token')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async resendVerificationEmail(@DecodeUser() user: User) {
    return await this.authService.resendVerificationEmail(user.id);
  }

  @Post('password/forgot')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(dto);
  }

  @Post('password/reset/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() dto: ResetPasswordDto,
  ) {
    return await this.authService.resetPassword(token, dto);
  }

  @Post('refresh')
  async refresh(@Res() res: Response, @Req() req: Request) {
    const refreshToken = req.cookies['refreshToken'];
    const tokens = await this.authService.refresh(refreshToken);
    await this.authService.setTokensCookie(res, tokens);
    return res.json(tokens);
  }

  @Delete('signOut')
  async signOut(
    @Res() res: Response,
    @Req() req: Request,
    @Query('full') full: boolean = false,
  ) {
    const refreshToken = req.cookies['refreshToken'];
    await this.authService.signOut(refreshToken, full);

    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');

    return res.sendStatus(HttpStatus.OK);
  }
}
