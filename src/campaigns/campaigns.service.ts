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
  CategoriesLv1,
  CategoriesLvoneDocument,
} from './schema/categories_level1.schema';
import {
  CategoriesLv2,
  CategoriesLvtwoDocument,
} from './schema/categories_level2.schema';
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
    @InjectModel(CategoriesLv1.name)
    private readonly CategoriesLv1Model: Model<CategoriesLvoneDocument>,
    @InjectModel(CategoriesLv2.name)
    private readonly CategoriesLv2Model: Model<CategoriesLvtwoDocument>,
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
        description2: data.description2,
        description3: data.description3,
        title: data.title,
        articles: data.articles,
        description1: data.description1,
        contentType: data.contentType,
        videos: data.videos,

        image: data.image,
        status: 'Approved',
        quizzes: data.quizzes,
      });
      //Add the campaigns to the respective creator
      return res;
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
            // flaqSpent: res.requiredFlaq,
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
    // await this.RewardsUser(user._id, campaign.flaqReward);
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
  //Creating Level 1 category campaing

  async createLvl1(data) {
    const res = this.CategoriesLv1Model.create({
      imageUrl: data.imageUrl,
      title: data.title,
      description: data.description,
      level2: data.level2,
    });
    return res;
  }
  // Creating Level 2 category campaign
  async createLvl2(data) {
    console.log('datazz', data);
    const response = await this.CategoriesLv2Model.create({
      title: data.title,
      campaigns: data.campaigns,
    });
    return response.save();
  }

  // fetching level1 content without populating
  async getlvl1Content() {
    return this.CategoriesLv1Model.find({});
  }
  // fetching level1 content without populating
  async getlvl2Content(id) {
    return await this.CategoriesLv1Model.findOne({ _id: id })
      .populate('level2')
      .populate({
        path: 'level2',
        populate: {
          path: 'Campaigns',
        },
      })
      .lean();
  }
}
