import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { JwtsService } from 'src/utils/jwt/jwt.service';

export class UserAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtsService,
    private readonly auth: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const req: Request = context.switchToHttp().getRequest();
    console.log(req.cookies);

    if (!req.cookies) req.cookies = {};
    if (!req.headers) req.headers = {};

    const { 'x-auth-token': accessTokenFromCookie } = req.cookies;
    // Headers doesn't recognise uppercase characters
    const { 'x-auth-token': accessTokenFromHeader } = req.headers;
    console.log(accessTokenFromHeader);
    if (!accessTokenFromCookie && !accessTokenFromHeader) {
      return true;
    }

    try {
      let accessTokenz: string;
      // If the token is from cookie or header
      if (accessTokenFromCookie) accessTokenz = accessTokenFromCookie;
      else if (accessTokenFromHeader)
        accessTokenz = String(accessTokenFromHeader);
      const useremail = await this.jwt.decodeAccessToken(accessTokenz);

      const user = await this.auth.findUserwithEmail(useremail);
      if (!user) throw new HttpException('User', HttpStatus.BAD_REQUEST);
      // @ts-ignore
      req.merchant = merchant;
      return true;
    } catch (e) {
      return false;
    }
  }
}
