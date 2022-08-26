import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { User, UserDocument } from '../user/schema/user.schema';
import {
  AddQuiztoCampaignDto,
  CampaignDto,
  CampaignIdDto,
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
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Create Campaign
   * @params Campaigndto
   * @returns Newly created Campaign object
   * */
  async createCampaign(data: CampaignDto) {
    try {
      const res = await this.CampaignModel.create({
        description: data.description,
        title: data.title,
        articles: data.articles,
        tickerName: '',
        contentType: data.contentType,
        tickerImageUrl: '',
        taskType: '',
        yTVideoUrl: data.yTVideoUrl || '',
        image: data.image || '',
        requiredFlaq: 0,
        flaqReward: 0,
        airDropUser: 0,
        totalAirDrop: 0,
        currentAirDrop: 0,
        quizzes: data.quizzes,
      });
      //Add the campaigns to the respective creator
    } catch (e) {
      return new HttpException('Request Body Invalid', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Create Quiz
   * params Quizdto
   * @returns Newly created Quiz object
   * */
  async createQuiz(data: QuizDto) {
    console.log(data);
    try {
      await this.QuizModel.create({
        title: data.title,
        questions: data.questions,
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
  async addQuiztoCampaign(data: AddQuiztoCampaignDto) {
    return await this.CampaignModel.findByIdAndUpdate(data.campaignId, {
      $set: {
        quizzes: data.quizId,
      },
    });
  }

  async getQuiz(campaignId) {
    console.log(campaignId);

    return await this.CampaignModel.findOne({ _id: campaignId }).populate(
      'quizzes',
    );
  }

  async getAllCampaigns(user) {
    const campaign = await this.CampaignModel.find({});
    const participations = await this.ParticipateCampaignModel.find({
      user: user._id,
    });

    const obj = { campaign: campaign, participations: participations };
    console.log(obj);
    return obj;
  }

  /**Participate in a Campaign */
  async participateCampaign(data: CampaignIdDto, user) {
    try {
      const res = await this.CampaignModel.findById({ _id: data.campaignId });
      if (res) {
        // if (res.requiredFlaq > user.flaqPoints) {
        //   throw new HttpException('Low Flaq points', HttpStatus.FORBIDDEN);
        // }
        //Todo Subtract the required flaq with users FlaqPoints

        const ParticipateCampaigndata =
          await this.ParticipateCampaignModel.create({
            campaign: res._id,
            user: user._id,
            flaqSpent: res.requiredFlaq,
          });

        return ParticipateCampaigndata.save();
      } else
        throw new HttpException(
          'Campaign Id not found',
          HttpStatus.BAD_REQUEST,
        );
    } catch (e) {
      return new HttpException('Campaign Id not found', HttpStatus.BAD_REQUEST);
    }
  }

  async evaluateQuiz(data: EvaluateQuizDto, user) {
    const { answers, campaignId, campaignPartipationId } = data;
    const campaign = await this.CampaignModel.findOne({
      _id: campaignId,
    }).populate('quizzes');
    // console.log(campaign);
    const quizz: any = campaign.quizzes[0];
    const quizzes = quizz.questions;
    // console.log(quizzes);

    if (quizzes.length !== answers.length)
      throw new HttpException('Request Body Invalid', HttpStatus.BAD_REQUEST);
    let correctCount = 0;

    for (let i = 0; i < answers.length; i++) {
      if (quizzes[i].answerIndex == answers[i]) {
        correctCount += 1;
      }
    }

    const questionsCount = quizzes.length;
    let isPassing = false;
    if ((correctCount / questionsCount) * 100 >= 80) {
      isPassing = true;
    }
    console.log(isPassing);
    const quiz_entriesData = await this.QuizEntriesModel.create({
      user: user._id,
      campaign: campaign._id,
      quiz: quizz._id,
      questionsCount,
      correctCount,
      isPassing,
    });
    // Updating the campaign participation with isComplete True
    if (quiz_entriesData) {
      await this.ParticipateCampaignModel.findByIdAndUpdate(
        { _id: campaignPartipationId },
        { $set: { isComplete: true } },
      );
    }
    // rewarding Users with Flaq with the flaqReward mentioned in Campaign
    await this.RewardsUser(user._id, campaign.flaqReward);
    //TODO Reward user with the flaq points mentioned in the campaign
    return quiz_entriesData;
  }

  async RewardsUser(Id: string, points: number) {
    try {
      await this.userModel.findByIdAndUpdate(
        { _id: Id },
        { $inc: { flaqPoints: points } },
      );
    } catch (e) {}
  }
}
