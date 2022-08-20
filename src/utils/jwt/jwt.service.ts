import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import configration from '../../common/configration';

import { AuthService } from '../../auth/auth.service';

@Injectable()
export class JwtsService {
  constructor(private readonly AuthService: AuthService) {}

  /**Create Access  */
  async createAccesstoken(email) {
    return jwt.sign({ email }, configration().jwtsecret, {
      expiresIn: '2h',
    });
  }
  // validate Access token
  async decodeAccessToken(token: string) {
    const data: any = jwt.verify(token, configration().jwtsecret);
    // console.log('Tokenz', tokenz);
    if (data) {
      return data.Email;
    } else {
      throw new HttpException('Invalid Access Token', HttpStatus.UNAUTHORIZED);
    }
  }
  /** Create refresh token */
  async createRefreshToken(user) {
    const { _id, userId } = user;
    const token = jwt.sign({ userId }, configration().jwtsecret, {
      expiresIn: '60d',
      jwtid: String(_id),
    });
    return token;
  }

  /**Validate Access token */

  /**Validate Refreshtoken */
  async decodeRefreshToken(refreshtokens: any): Promise<any> {
    try {
      const payload: string | jwt.JwtPayload = jwt.verify(
        refreshtokens,
        configration().jwtsecret,
      );
      // console.log(payload);
      return payload;
    } catch (e) {
      throw new HttpException('Invalid RefreshToken', HttpStatus.NOT_FOUND);
    }
  }
}
