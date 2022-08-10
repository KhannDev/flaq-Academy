import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserCredentialsdto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { HashingService } from 'src/utils/hashing/hashing.service';
import { JwtsService } from 'src/utils/jwt/jwt.service';
import { AuthService } from './auth.service';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authservice: AuthService,
    private readonly jwt: JwtsService,
    private readonly userservice: UserService,
    private readonly hashingservice: HashingService,
  ) {}

  /**User sign up  */
  @ApiOperation({
    summary: 'User Sign up',
  })
  @Post('signup')
  async signup(@Body() data: UserCredentialsdto) {
    console.log(data.Email);
    const user = await this.userservice.findUserwithEmail(data.Email);

    if (!user) {
      const newUser = this.authservice.CreateUser(data);

      const accessToken = await this.jwt.CreateAccesstoken(data);
      const refreshtokendata = await this.authservice.CreateRefreshToken(data);
      const refreshtoken = await this.jwt.CreateRefreshToken(refreshtokendata);
      return { accessToken, refreshtoken };
      /** Response to store access and refresh token in cookies */
    } else {
      throw new HttpException('User already Exists', HttpStatus.CONFLICT);
    }
  }
  /**Login in  */
  @ApiOperation({ summary: 'Login In user' })
  @Post('/login')
  async Login(
    @Body() data: UserCredentialsdto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userz = await this.userservice.findUserwithEmail(data.Email);
    if (userz) {
      const matchPassword = await this.hashingservice.compare(
        userz.Password,
        data.Password,
      );

      if (!matchPassword) {
        throw new HttpException(
          `Password is incorrect`,
          HttpStatus.UNAUTHORIZED,
        );
      }
      const accessToken = await this.jwt.CreateAccesstoken(userz.Email);
      response.cookie('x-access-token', accessToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure: false,
      });
      const refreshtokendata = await this.authservice.CreateRefreshToken(userz);
      const refreshtoken = await this.jwt.CreateRefreshToken(refreshtokendata);
      response.cookie('x-refresh-token', refreshtoken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
      });
      return { accessToken, refreshtoken };
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    /**Refresh Access token */
  }
}
