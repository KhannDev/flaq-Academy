import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserCredentialsdto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  /**User sign up  */
  @ApiOperation({
    summary: 'User Sign up',
  })
  @Post()
  signup(@Body() user: UserCredentialsdto) {}
}
