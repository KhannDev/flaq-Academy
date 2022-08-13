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
import { UserService } from 'src/user/user.service';
import { JwtsService } from 'src/utils/jwt/jwt.service';

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtsService,
    private readonly auth: UserService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();

    // console.log({ cookies: req.cookies, headers: req.headers });

    let data = [];
    data.push(req.headers.cookie);

    const dataInString = data[0].split(' ');

    let headers: any = {};
    for (let n of dataInString) {
      const news = n.split('=');
      headers[news[0]] = news[1];
    }
    if (!req.cookies) req.cookies = {};
    if (!req.headers) req.headers = {};

    const { 'x-access-token': accessTokenFromCookie } = req.cookies;

    const { 'x-access-token': accessTokenFromHeader } = headers;
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
      const trimedaccessToken = accessToken.replace(';', '');

      const useremail = await this.jwt.decodeAccessToken(trimedaccessToken);

      const user = await this.auth.findUserwithEmail(useremail);
      if (!user)
        throw new HttpException('No Such Users', HttpStatus.BAD_REQUEST);
      // @ts-ignore
      req.user = user;
      return true;
    } catch (e) {
      console.log(e.message);
      return false;
    }
  }
}
