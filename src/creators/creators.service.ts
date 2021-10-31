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
import { Client, KeyInfo, ThreadID } from '@textile/hub';
import { CampaignDto } from 'src/campaigns/dto/campaign.dto';

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

  async createCampaign(data: CampaignDto, user) {
    const res = await this.campaignmodel.create({
      description1: data.description1,
      title: data.title,
      articles: data.articles,
      contentType: data.contentType,
      videos: data.videos,
      image: data.image,
      quizzes: data.quizzes,
      status: 'Pipeline',
      walletAddress: data.walletAddress,
    });

    const { client, threadId } = await this.getThreadDBProvider();
    await this.collectionFromSchema(client, threadId, data);
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

  /**
   * function for creating the client Instance for Textile DB
   * @returns
   */
  getThreadDBProvider = async () => {
    const keyInfo: KeyInfo = {
      key: 'bptpczijup3rzdyj7zopdhk7jjm',
      secret: 'b2y65p3bq4ccjk2mo4gdoqi4ds7qhqyalbyts57a',
    };
    const client = await Client.withKeyInfo(keyInfo);
    const threadId = ThreadID.fromString(
      'bafkwuip6fdr5m5o75lgtezpkzeuuach4gql4uemxa7yexophqw6wxcq',
    );
    return { client, threadId };
  };

  /**
   * function for storing the data
   * @param client Client Id
   * @param threadID Thread Id
   * @param data Campaign data
   */
  collectionFromSchema = async (client, threadID, data: CampaignDto) => {
    const created = await client.create(threadID, 'Campaign', [
      {
        title: data.title,
        description: data.description1,
        image: data.image,
        status: 'Pipeline',
        video: data.videos[0].url,
        contentType: data.contentType,
        article: data.articles[0].url,
      },
    ]);

    const all = await client.find(threadID, 'Campaign', {});
    console.log(await all);
  };
}
