import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCredentialsdto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { RefreshToken } from 'src/utils/jwt/schema/Refreshtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshtokenmodel: Model<RefreshToken>,
    private readonly userservice: UserService,
  ) {}
  async CreateRefreshToken(data) {
    const refreshToken = await this.refreshtokenmodel.create({
      userId: data._id,
      expires: new Date(Date.now() + Number(30) * 24 * 60 * 60 * 1000),
    });
    return refreshToken;
  }
  /**Check if the user is created  */

  /**Create the User */
  async CreateUser(user: UserCredentialsdto) {
    return await this.userservice.CreateUser(user);
  }
  /** Create Token  */
}
