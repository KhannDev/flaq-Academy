import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { CreatorsService } from 'src/creators/creators.service';
import { UserService } from '../../user/user.service';
import { JwtsService } from '../../utils/jwt/jwt.service';

@Injectable()
export class CreatorAuthGuard implements CanActivate {
  constructor(
    private readonly creatorservice: CreatorsService,
    private readonly reflector: Reflector,
    private readonly discordGuild: AuthService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    // console.log(req);

    // console.log({ cookies: req.cookies, headers: req.headers });

    if (!req.cookies) req.cookies = {};
    if (!req.headers) req.headers = {};

    const { 'x-access-token': accessTokenFromCookie } = req.cookies;

    const { 'x-access-token': accessTokenFromHeader } = req.headers;
    // console.log(accessTokenFromHeader);
    if (!accessTokenFromCookie && !accessTokenFromHeader) {
      return false;
    }

    try {
      let accessToken: string;
      // If the token is from cookie or header
      if (accessTokenFromCookie) accessToken = accessTokenFromCookie;
      else if (accessTokenFromHeader)
        accessToken = String(accessTokenFromHeader);
      // console.log('access token', accessToken);

      //   if (!userEmail) {
      //     throw new HttpException(
      //       'Invalid Access token',
      //       HttpStatus.UNAUTHORIZED,
      //     );
      //   }
      const { email } = await this.discordGuild.getDiscordUserData(accessToken);
      console.log('guard email', email);
      const creator = await this.creatorservice.findCreatorbyEmail(email);
      console.log(creator);
      if (!creator)
        throw new HttpException('No Such creators', HttpStatus.BAD_REQUEST);

      req.user = creator;
      return true;
    } catch (e) {
      if (e.message === 'Invalid Access token') {
        throw new HttpException(
          'Invalid Access token',
          HttpStatus.UNAUTHORIZED,
        );
      }
      return false;
    }
  }
}
