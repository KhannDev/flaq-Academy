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
import { Contributor } from './schema/auth.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
    @InjectModel(Contributor.name)
    private readonly contributorModel: Model<Contributor>,
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

  /**Create the User */
  async createUser(user: UserCredentialsDto) {
    return await this.userservice.createUser(user);
  }

  //Discord API's

  // Creating a Contributor
  async createContributor(data) {
    try {
      const res = await this.contributorModel.create({
        username: data.username,
        email: data.email,
        avator: data.avator,
        discordId: data.id,
      });
      return res.save();
    } catch (e) {
      return null;
    }
  }

  //Get user with email Id
  async getUser(email: string) {
    return this.contributorModel.findOne({ email });
  }

  //Get discored user data
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
      return e.message;
    }
  }

  //Check if the user is part of the Guild Flaq Club, If not thorw an error
  async userGuild(access_token) {
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
      const data = res.data.find((o) => o.name === 'Flaq Club');
      if (!data)
        throw new HttpException(
          'User not a member of Flaq Club',
          HttpStatus.UNAUTHORIZED,
        );
    } catch (e) {
      return e.message;
    }
  }
}
