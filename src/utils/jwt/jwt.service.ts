import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignOptions } from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import configration from 'src/common/configration';
import { compileFunction } from 'vm';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './schema/Refreshtoken';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
const BASE_OPTIONS: SignOptions = {
  issuer: configration().jwtsecret,
};
const user = { _id: '62ebbe803152947ce40b0092' };

@Injectable()
export class JwtsService {
  constructor(private readonly AuthService: AuthService) {}

  async generateRefreshToken(Id) {
    return jwt.sign({ Id }, configration().jwtsecret, {
      expiresIn: '4s',
      jwtid: 'sdkfjds',
    });
  }
  async decodeAccessToken(token) {
    try {
      const tokenz: any = jwt.verify(token, configration().jwtsecret);
      //   console.log(tokenz);
      return tokenz.email;
    } catch (e) {
      throw new HttpException('Invalid Access Token', HttpStatus.UNAUTHORIZED);
    }
  }

  /**Get Access and refresh token */
  async CreateAccesstoken(email) {
    return jwt.sign({ email }, configration().jwtsecret, {
      expiresIn: '2h',
    });
  }

  async CreateRefreshToken(user) {
    const { _id, userId } = user;
    const token = jwt.sign({ userId }, configration().jwtsecret, {
      expiresIn: '60d',
      jwtid: String(_id),
    });
    return token;
  }

  /**Validate Access token */

  /**Validate Refreshtoken */
  decoderefreshToken(refreshtokens) {
    const payload: string | jwt.JwtPayload = jwt.verify(
      refreshtokens,
      configration().jwtsecret,
    );
    const rubbish = this.getJti(payload);

    /**refresh Access Token */
  }
  async getJti(payload) {
    const Jti = payload.jti;
    return Jti;
  }
}
