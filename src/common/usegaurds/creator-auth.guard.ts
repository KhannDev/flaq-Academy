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

    if (!req.cookies) req.cookies = {};
    if (!req.headers) req.headers = {};

    console.log(req);
    const { 'x-creator-access-token': accessTokenFromCookie } = req.cookies;

    const { 'x-creator-refresh-token': accessTokenFromHeader } = req.headers;
    // console.log(accessTokenFromHeader);
    if (!accessTokenFromCookie && !accessTokenFromHeader) {
      return false;
    }

    let accessToken: string;
    // If the token is from cookie or header
    if (accessTokenFromCookie) accessToken = accessTokenFromCookie;
    else if (accessTokenFromHeader) accessToken = String(accessTokenFromHeader);

    const { email } = await this.discordGuild.getDiscordUserData(accessToken);

    const creator = await this.creatorservice.findCreatorbyEmail(email);

    if (!creator)
      throw new HttpException('No Such creators', HttpStatus.BAD_REQUEST);

    req.user = creator;
    return true;
  }
}
