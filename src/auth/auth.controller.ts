import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { RefreshTokenDto, UserCredentialsDto } from 'src/user/dto/user.dto';
import { UserService } from '../user/user.service';
import { HashingService } from '../utils/hashing/hashing.service';
import { JwtsService } from '../utils/jwt/jwt.service';
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
  @Post('/signup')
  async signUp(
    @Body() data: UserCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(data.email);
    const user = await this.userservice.findUserwithEmail(data.email);

    if (!user) {
      const newUser = await this.authservice.createUser(data);
      console.log(newUser);
      //Generate Access token for the user
      const accessToken = await this.jwt.createAccesstoken(newUser.email);
      console.log(accessToken);
      response.cookie('x-access-token', accessToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure: false,
      });
      //Generate Refresh token for the user
      const refreshtokendata = await this.authservice.createRefreshToken(
        newUser,
      );
      const refreshtoken = await this.jwt.createRefreshToken(refreshtokendata);
      response.cookie('x-refresh-token', refreshtoken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
      });
      return { accessToken, refreshtoken };
      /** Response to store access and refresh token in cookies */
    } else {
      throw new HttpException('User already Exists', HttpStatus.FORBIDDEN);
    }
  }
  /**Login in  */
  @ApiOperation({ summary: 'Login In user' })
  @Post('/login')
  async login(
    @Body() data: UserCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userz = await this.userservice.findUserwithEmail(data.email);
    if (userz) {
      const matchPassword = await this.hashingservice.compare(
        userz.password,
        data.password,
      );

      if (!matchPassword) {
        throw new HttpException(
          `Password is incorrect`,
          HttpStatus.UNAUTHORIZED,
        );
      }
      const accessToken = await this.jwt.createAccesstoken(userz.email);
      response.cookie('x-access-token', accessToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure: false,
      });
      const refreshtokendata = await this.authservice.createRefreshToken(userz);
      const refreshtoken = await this.jwt.createRefreshToken(refreshtokendata);
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

  @Post('/RefreshAccessToken')
  async issueNewAccessToken(
    @Body() datas: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      // console.log(RefreshToken);
      const data = await this.jwt.decodeRefreshToken(datas.refreshToken);
      console.log(data);
      if (!data) {
        throw new HttpException('Invalid RefreshToken', HttpStatus.NOT_FOUND);
      }
      const { email } = await this.userservice.findUser(data.userId);

      const accessToken = await this.jwt.createAccesstoken(email);
      response.cookie('x-access-token', accessToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure: false,
      });
      return { accessToken };
    } catch (e) {
      return e;
    }
  }
  @Get('logout')
  @ApiOperation({
    description: 'Log the user out of the system',
  })
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('x-access-token', 'none');
    response.cookie('x-refresh-token', 'none');
    return {
      loggedOut: true,
    };
  }
}
