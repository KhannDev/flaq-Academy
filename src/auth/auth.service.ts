import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserCredentialsDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { RefreshToken } from '../utils/jwt/schema/Refreshtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshtokenmodel: Model<RefreshToken>,
    private readonly userservice: UserService,
  ) {}
  async createRefreshToken(data) {
    const refreshToken = await this.refreshtokenmodel.create({
      userId: data._id,
      expires: new Date(Date.now() + Number(30) * 24 * 60 * 60 * 1000),
    });
    return refreshToken;
  }
  /**Check if the user is created  */

  /**Create the User */
  async createUser(user: UserCredentialsDto) {
    return await this.userservice.createUser(user);
  }
  /** Create Token  */
}
