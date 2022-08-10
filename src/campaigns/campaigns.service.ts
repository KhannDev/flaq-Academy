import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { AddQuiztoCampaignDto, CampaignDto, QuizDto } from './dto/campaign.dto';
import { Campaign, CampaignDocument } from './schema/campaigns.schema';
import {
  ParticipateCampaign,
  ParticipateCampaignDocument,
} from './schema/participate.schema';
import { Quiz, QuizDocument } from './schema/quiz.schema';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name)
    private readonly CampaignModel: Model<CampaignDocument>,
    @InjectModel(Quiz.name)
    private readonly QuizModel: Model<QuizDocument>,
    @InjectModel(ParticipateCampaign.name)
    private readonly ParticipateCampaignModel: Model<ParticipateCampaignDocument>,
  ) {}

  /**
   * Create Campaign
   * @params Campaigndto
   * @returns Newly created Campaign object
   * */
  async CreateCampaign(data: CampaignDto) {
    await this.CampaignModel.create({
      Description: data.Description,
      Title: data.Title,
      Articles: data.Articles,
      TickerName: data.TickerName,
      TickerImageUrl: data.TickerImageUrl,
      TaskType: data.TaskType,
      YTVideoUrl: data.YtVideoUrl,
      Image: data.Image,
      RequiredFlaq: data.RequiredFlaq,
      FlaqReward: data.FlaqReward,
      AirDropUser: data.AirDropUser,
      TotalAirDrop: data.TotalAirDrop,
      CurrentAirDrop: data.CurrentAirDrop,
      Quizzes: data.Quizzes,
    });
  }

  /**
   * Create Quiz
   * @params Quizdto
   * @returns Newly created Quiz object
   * */
  async CreateQuiz(data: QuizDto) {
    try {
      await this.QuizModel.create({
        Title: data.Title,
        Questions: data.Questions,
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  /**
   * Add quiz to the Campaign
   * @params Campaign and quiz Ids
   * @returns Apeended Campaign Object
   * */
  async AddQuiztoCampaign(data: AddQuiztoCampaignDto) {
    return await this.CampaignModel.findByIdAndUpdate(data.CampaignId, {
      $set: {
        Quizzes: data.QuizId,
      },
    });
  }

  /**
   * Check for campaign with Id
   * @param Id
   * @returns Campaigns Id if present in the database or throw an error "Invalid Campaign ID"
   * */

  /**
   * Check for quiz with Id
   * @param Id
   * @returns quiz Id if present in the database or throw an error "Invalid Campaign ID"
   * */
  async GetQuiz(campaignId) {
    console.log(campaignId);

    return await this.CampaignModel.find({ _id: campaignId }).populate(
      'Quizzes',
    );
  }

  async GetAllCampaigns() {
    const res = await this.CampaignModel.find({});
    return res;
  }

  /**Participate in a Campaign */
  async ParticipateCampaign(data, user) {
    const res: any = await this.CampaignModel.find({ _id: data });
    /**TODO Check if the user have sufficient flaq points */
    if (res.RequiredFlaq)
      if (res) {
        const dataz = this.ParticipateCampaignModel.create({
          Campaign: data.Campaign,
          User: user,
          // FlaqSpent: res.RequiredFlaq,
        });

        data.save();
      }
  }
}
