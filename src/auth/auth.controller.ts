import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import * as qs from 'qs';

import { HttpService } from '@nestjs/axios';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { response, Response } from 'express';
import { lastValueFrom } from 'rxjs';

import { UserCredentialsDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { HashingService } from '../utils/hashing/hashing.service';
import { JwtsService } from '../utils/jwt/jwt.service';
import { AuthService } from './auth.service';
import configuration from 'src/common/configuration';
import { CodeArtifact } from 'aws-sdk';
import { DiscordCodeDto } from './dto/auth.dto';
import { RefreshTokenDto } from 'src/campaigns/dto/campaign.dto';

/**
 * Controller to handle Authentication
 */
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    // private readonly url: URL,
    private readonly httpservice: HttpService,
    private readonly authservice: AuthService,
    private readonly jwt: JwtsService,
    private readonly userservice: UserService,
    private readonly hashingservice: HashingService,
  ) {}

  /**
   * User sign up
   * @body email, password and device token
   * @returns access and refresh token
   */

  @ApiOperation({
    summary: 'user Sign up',
  })
  @ApiResponse({ status: 201, description: 'The User is created Successfully' })
  @Post('/signup')
  async signUp(
    @Body() data: UserCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userservice.findUserwithEmail(data.email);

    if (!user) {
      const newUser = await this.authservice.createUser(data);

      //Generate Access token for the user
      const accessToken = await this.jwt.createAccesstoken(newUser.email);

      response.cookie('x-access-token', accessToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
      });
      //Generate Refresh token for the user
      const refreshtokendata = await this.authservice.createRefreshToken(
        newUser,
      );
      const refreshtoken = await this.jwt.createRefreshToken(refreshtokendata);
      response.cookie('x-refresh-token', refreshtoken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
      });
      return { accessToken, refreshtoken };
    } else {
      throw new HttpException('User already Exists', HttpStatus.FORBIDDEN);
    }
  }

  /**
   * Login In User
   * @body email, password and device token
   * @returns access and refresh token
   */

  @ApiOperation({ summary: 'login In user' })
  @ApiResponse({
    status: 201,
    description: 'The User is Logged in  Successfully',
  })
  @Post('/login')
  async login(
    @Body() data: UserCredentialsDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.userservice.findUserwithEmail(data.email);
    if (user) {
      const matchPassword = await this.hashingservice.compare(
        user.password,
        data.password,
      );

      if (!matchPassword) {
        throw new HttpException(
          `Password is incorrect`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const accessToken = await this.jwt.createAccesstoken(user.email);
      response.cookie('x-access-token', accessToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure: false,
      });

      const refreshTokenData = await this.authservice.createRefreshToken(user);

      const refreshToken = await this.jwt.createRefreshToken(refreshTokenData);

      response.cookie('x-refresh-token', refreshToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
      });
      return { accessToken, refreshToken };
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  /**
   * Login In User
   * @body refresh token
   * @returns access token
   */

  @ApiOperation({ summary: 'refresh Access token ' })
  @ApiResponse({
    status: 201,
    description: ' New Access token created Successfully',
  })
  @Post('token/refresh')
  async issueNewAccessToken(
    @Body() body: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.jwt.decodeRefreshToken(body.refreshToken);

    const { email } = await this.userservice.findUser(data.userId);

    if (email) {
      const accessToken = await this.jwt.createAccesstoken(email);

      response.cookie('x-access-token', accessToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
      });
      return { accessToken };
    } else throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);
  }
  //Logout user
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
  // Authenticating Creators Login from Discords Login
  @ApiOperation({
    summary: 'authenticate Discord Login For creators Dashboard',
  })
  @ApiResponse({
    status: 201,
    description: 'The User is Logged in  Successfully',
  })
  @Post('/discord-auth')
  async Discordsetup(
    // @Query('code') code: string,
    @Body() data: DiscordCodeDto,
    @Res({ passthrough: true })
    response: Response,
  ) {
    console.log('code', data.code);
    let res;
    try {
      res = await lastValueFrom(
        this.httpservice.request({
          method: 'POST',
          url: 'https://discord.com/api/oauth2/token',
          data: qs.stringify({
            client_id: configuration().discord_access_id,
            client_secret: configuration().discord_secret,
            grant_type: 'authorization_code',
            code: data.code,
            redirect_uri: configuration().discord_redirect_url,
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );
    } catch (e) {
      throw new HttpException('Invalid Body request', HttpStatus.BAD_REQUEST);
    }

    //Check if the user if part of Flaq Club guild
    await this.authservice.userGuild(res.data.access_token);

    //Get discord users meta data
    const userDiscordData = await this.authservice.getDiscordUserData(
      res.data.access_token,
    );
    //Check if the user is already created
    let userData = await this.authservice.getUser(userDiscordData.email);
    response.cookie('x-access-token', res.data.access_token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    response.cookie('x-refresh-token', res.data.refresh_token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
    });
    if (!userData) {
      userData = await this.authservice.createCreator(userDiscordData);
    }
    return {
      data: userData,
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token,
    };
  }
}
