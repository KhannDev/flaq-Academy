import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpServer,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { UserCredentialsDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { RefreshToken } from '../utils/jwt/schema/Refreshtoken';
import { Creators } from './schema/auth.schema';

/** Service to handle Authentication funtionality */

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    @InjectModel(Creators.name)
    private readonly creatorModel: Model<Creators>,
    private readonly userservice: UserService,
    private readonly httpservice: HttpService,
  ) {}

  async createRefreshToken(data) {
    const refreshToken = await this.refreshTokenModel.create({
      userId: data._id,
      expires: new Date(Date.now() + Number(30) * 24 * 60 * 60 * 1000),
    });
    return refreshToken;
  }

  /**Create User */

  async createUser(user: UserCredentialsDto) {
    return await this.userservice.createUser(user);
  }

  /** Creating a Creator */

  async createCreator(data) {
    try {
      const res = await this.creatorModel.create({
        username: data.username,
        email: data.email,
        avator: data.avator,
        discordId: data.id,
      });
      return res.save();
    } catch (e) {
      throw new HttpException(
        'Creating Creator Failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**Get user with email Id */

  async getUser(email: string) {
    return this.creatorModel.findOne({ email });
  }

  /**Get discored user data */
  async getDiscordUserData(access_token) {
    try {
      const res = await lastValueFrom(
        this.httpservice.request({
          method: 'GET',
          url: 'https://discord.com/api/v8/users/@me',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }),
      );
      return res.data;
    } catch (e) {
      throw new HttpException('Invalid Access token', HttpStatus.UNAUTHORIZED);
    }
  }

  /** Check if the user is part of the Guild Flaq Club,
   * If not throw an error
   */

  async userGuild(access_token: string) {
    try {
      const res = await lastValueFrom(
        this.httpservice.request({
          method: 'GET',
          url: 'https://discord.com/api/v8/users/@me/guilds',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }),
      );

      //check if the user is present in the flaq club server

      const data = res.data.find((o) => o.name === 'Flaq Academy');

      if (typeof data == 'undefined') {
        throw new HttpException(
          'User not a member of Flaq Academy',
          HttpStatus.FORBIDDEN,
        );
      }
    } catch (e) {
      throw new HttpException(
        'User not a member of Flaq Academy',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  /**
   * To access the role of the dicord user
   */

  async getUserRole(access_token: string) {
    const adminId = '99892008377673735';
    const creatorId = '1023418480080470090';

    let userRole: string;
    try {
      const res = await lastValueFrom(
        this.httpservice.request({
          method: 'GET',
          url: 'https://discord.com/api/v6/users/@me/guilds/946822469459787827/member',
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }),
      );
      console.log(res.data.roles);

      for (const role of res.data.roles) {
        if (role === adminId) {
          userRole = 'Admin';
        } else if (role === creatorId) {
          userRole = 'Creator';
        }
      }
      return userRole;
    } catch (e) {
      throw new HttpException('Invalid Access token', HttpStatus.UNAUTHORIZED);
    }
  }
}
