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
    // console.log(req.cookies);
    // console.log(req.headers);
    // console.log({ cookies: req.cookies, headers: req.headers });

    let data = [];
    data.push(req.headers.cookie);

    const newss = data[0].split(' ');

    let something: any = {};
    for (let n of newss) {
      const news = n.split('=');
      // console.log(news[0]);
      something[news[0]] = news[1];
    }
    console.log(something);

    // console.log(req.headers.cookies);

    // console.log(isPublic);
    if (!req.cookies) req.cookies = {};
    if (!req.headers) req.headers = {};

    const { 'x-access-token': accessTokenFromCookie } = req.cookies;
    // Headers doesn't recognise uppercase characters
    const { 'x-access-token': accessTokenFromHeader } = something;
    // console.log(accessTokenFromHeader);
    if (!accessTokenFromCookie && !accessTokenFromHeader) {
      console.log(1);
      return false;
    }
    console.log(accessTokenFromHeader);
    try {
      let accessTokenz: string;
      // If the token is from cookie or header
      if (accessTokenFromCookie) accessTokenz = accessTokenFromCookie;
      else if (accessTokenFromHeader)
        accessTokenz = String(accessTokenFromHeader);
      const trimed = accessTokenz.replace(';', '');
      console.log(trimed);
      const useremail = await this.jwt.decodeAccessToken(trimed);
      console.log(useremail);

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
