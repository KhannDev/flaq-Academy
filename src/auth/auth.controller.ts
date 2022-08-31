import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Redirect,
  Res,
  UseGuards,
} from '@nestjs/common';
import * as qs from 'qs';

import { HttpService } from '@nestjs/axios';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { response, Response } from 'express';
import { lastValueFrom } from 'rxjs';

import { RefreshTokenDto, UserCredentialsDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { HashingService } from '../utils/hashing/hashing.service';
import { JwtsService } from '../utils/jwt/jwt.service';
import { AuthService } from './auth.service';
import configuration from 'src/common/configuration';
import { CodeArtifact } from 'aws-sdk';

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

  /**User sign up  */
  @ApiOperation({
    summary: 'User Sign up',
  })
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

      const refreshtokendata = await this.authservice.createRefreshToken(user);

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

  @Post('token/refresh')
  async issueNewAccessToken(
    @Body() datas: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      const data = await this.jwt.decodeRefreshToken(datas.refreshToken);

      const { email } = await this.userservice.findUser(data.userId);

      if (email) {
        const accessToken = await this.jwt.createAccesstoken(email);

        response.cookie('x-access-token', accessToken, {
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          httpOnly: false,
          secure: false,
        });
        return { accessToken };
      } else throw new HttpException('User Not Found', HttpStatus.BAD_REQUEST);
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

  @Post('/discord-auth')
  async Discordsetup(
    // @Query('code') code: string,
    @Body() data,
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
    //TODO check if the user is of role Admin

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
      httpOnly: false,
      secure: false,
    });
    response.cookie('x-refresh-token', res.data.refresh_token, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: false,
      secure: false,
    });
    if (!userData) {
      userData = await this.authservice.createCreator(userDiscordData);
    }
    return userData;
  }
}
