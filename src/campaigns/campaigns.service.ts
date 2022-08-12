import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';
import {
  AddQuiztoCampaignDto,
  CampaignDto,
  EvaluateQuizDto,
  QuizDto,
} from './dto/campaign.dto';
import { Campaign, CampaignDocument } from './schema/campaigns.schema';
import {
  ParticipateCampaign,
  ParticipateCampaignDocument,
} from './schema/participate.schema';
import { Quiz, QuizDocument } from './schema/quiz.schema';
import { QuizEntries, QuizEntriesDocument } from './schema/quiz_entries.schema';

@Injectable()
export class CampaignsService {
  constructor(
    @InjectModel(Campaign.name)
    private readonly CampaignModel: Model<CampaignDocument>,
    @InjectModel(Quiz.name)
    private readonly QuizModel: Model<QuizDocument>,
    @InjectModel(ParticipateCampaign.name)
    private readonly ParticipateCampaignModel: Model<ParticipateCampaignDocument>,
    @InjectModel(QuizEntries.name)
    private readonly QuizEntriesModel: Model<QuizEntriesDocument>,
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
    try {
      const res = await this.CampaignModel.find({ _id: data.campaignId });

      if (res[0].RequiredFlaq > user.FlaqPoints) {
        throw new HttpException('Low Flaq points', HttpStatus.FORBIDDEN);
      }

      if (res) {
        const dataz = await this.ParticipateCampaignModel.create({
          Campaign: data.CampaignId,
          User: user._id,
          FlaqSpent: res[0].RequiredFlaq,
        });

        return dataz.save();
      }
    } catch (e) {
      return e;
    }
  }

  async evaluateQuiz(data: EvaluateQuizDto, user) {
    const { Answers, campaignId, campaignPartipationId, quizTemplateId } = data;
    const campaign = await this.CampaignModel.find({
      _id: campaignId,
    }).populate('Quizzes');
    const Quizzes: any = campaign[0].Quizzes;

    if (Quizzes.length !== Answers.length)
      throw new HttpException('request body Invalid', HttpStatus.BAD_REQUEST);
    let CorrectCount = 0;
    for (let i = 0; i < Answers.length; i++) {
      if (Quizzes[i].Questions.AnswerIndex == Answers[i]) {
        CorrectCount += 1;
      }
    }

    const QuestionsCount = Quizzes.length;
    let IsPassing = false;
    if ((CorrectCount / QuestionsCount) * 100 >= 80) {
      IsPassing = true;
    }
    const quiz_entriesData = await this.QuizEntriesModel.create({
      User: user._id,
      Campaign: campaign[0]._id,
      Quiz: quizTemplateId,
      QuestionsCount,
      CorrectCount,
      IsPassing,
    });
    await this.ParticipateCampaignModel.find(
      { _id: campaignPartipationId },
      { $set: { isComplete: true } },
    );
    return quiz_entriesData;
    //TODO create the Quiz Entries
    //TODO Update the Campaign participation, if Ispassing==true
  }
}
