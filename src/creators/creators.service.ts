import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpServer,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { lastValueFrom, queueScheduler } from 'rxjs';
import { Creators, CreatorsDocument } from 'src/auth/schema/auth.schema';
import * as qs from 'qs';
import configuration from 'src/common/configuration';
import {
  Campaign,
  CampaignDocument,
} from 'src/campaigns/schema/campaigns.schema';

@Injectable()
export class CreatorsService {
  constructor(
    @InjectModel(Creators.name)
    private readonly creatormodel: Model<CreatorsDocument>,
    private readonly httpservice: HttpService,
    @InjectModel(Campaign.name)
    private readonly campaignmodel: Model<CampaignDocument>,
  ) {}

  async findCreatorbyEmail(email: string) {
    const res = await this.creatormodel.findOne({ email: email });
    return res;
  }

  /***
   * Refresh Access token
   ***/
  async refreshDiscordAccessToken(refresh_token: string) {
    try {
      const res = await lastValueFrom(
        this.httpservice.request({
          method: 'POST',
          url: 'https://discord.com/api/oauth2/token',
          data: qs.stringify({
            client_id: configuration().discord_access_id,
            client_secret: configuration().discord_secret,
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }),
      );

      return res.data;
    } catch (e) {
      throw new HttpException('Invalid body request', HttpStatus.BAD_GATEWAY);
    }
  }

  /***
   * Create Campaign for Creators
   ***/

  async createCampaign(data, user) {
    const res = await this.campaignmodel.create({
      description1: data.description1,
      title: data.title,
      articles: data.articles,
      contentType: data.contentType,
      videos: data.video,
      image: data.image,
      quizzes: data.quizzes,
      status: 'Pipeline',
    });
    // return res;

    await this.creatormodel.findByIdAndUpdate(
      { _id: user._id },
      { $push: { campaigns: res._id.toString() } },
    );
    return res;
  }

  /***
   * Fetching Campaings for creators
   ***/

  async getCampaigns(user) {
    return this.creatormodel.find({ _id: user._id }).populate('campaigns');
  }
}
