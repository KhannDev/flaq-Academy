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
  async createCampaign(data: CampaignDto) {
    await this.CampaignModel.create({
      description: data.description,
      title: data.title,
      articles: data.articles,
      tickerName: data.tickerName,
      tickerImageUrl: data.tickerImageUrl,
      taskType: data.taskType,
      yTVideoUrl: data.ytVideoUrl,
      image: data.image,
      requiredFlaq: data.requiredFlaq,
      flaqReward: data.flaqReward,
      airDropUser: data.airDropUser,
      totalAirDrop: data.totalAirDrop,
      currentAirDrop: data.currentAirDrop,
      quizzes: data.quizzes,
    });
  }

  /**
   * Create Quiz
   * @params Quizdto
   * @returns Newly created Quiz object
   * */
  async createQuiz(data: QuizDto) {
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
        Quizzes: data.quizId,
      },
    });
  }

  async getQuiz(campaignId) {
    console.log(campaignId);

    return await this.CampaignModel.findOne({ _id: campaignId }).populate(
      'quizzes',
    );
  }

  async getAllCampaigns() {
    const res = await this.CampaignModel.find({});
    return res;
  }

  /**Participate in a Campaign */
  async participateCampaign(data, user) {
    try {
      const res = await this.CampaignModel.findById({ _id: data.campaignId });

      if (res.requiredFlaq > user.FlaqPoints) {
        throw new HttpException('Low Flaq points', HttpStatus.FORBIDDEN);
      }

      if (res) {
        const ParticipateCampaigndata =
          await this.ParticipateCampaignModel.create({
            campaign: data.campaignId,
            user: user._id,
            flaqSpent: res.requiredFlaq,
          });

        return ParticipateCampaigndata.save();
      }
    } catch (e) {
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async evaluateQuiz(data: EvaluateQuizDto, user) {
    const { answers, campaignId, campaignPartipationId, quizTemplateId } = data;
    const campaign = await this.CampaignModel.findOne({
      _id: campaignId,
    }).populate('Quizzes');
    const quizzes: any = campaign[0].quizzes;

    // if (Quizzes.length !== Answers.length)
    //   throw new HttpException('Request Body Invalid', HttpStatus.BAD_REQUEST);
    let correctCount = 0;

    for (let i = 0; i < answers.length; i++) {
      if (quizzes[i].questions.answerIndex == answers[i]) {
        correctCount += 1;
      }
    }

    const questionsCount = quizzes.length;
    let isPassing = false;
    if ((correctCount / questionsCount) * 100 >= 80) {
      isPassing = true;
    }
    const quiz_entriesData = await this.QuizEntriesModel.create({
      user: user._id,
      campaign: campaign[0]._id,
      quiz: quizTemplateId,
      questionsCount,
      correctCount,
      isPassing,
    });
    //Updating the campaign participation with isComplete True
    if (quiz_entriesData) {
      await this.ParticipateCampaignModel.find(
        { _id: campaignPartipationId },
        { $set: { isComplete: true } },
      );
    }
    return quiz_entriesData;
  }
}
