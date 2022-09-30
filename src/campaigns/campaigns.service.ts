import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { addCampaigntoLvl2Dto } from 'src/admin/dto/admin.dto';
import { User, UserDocument } from '../user/schema/user.schema';
import {
  AddQuiztoCampaignDto,
  CampaignDto,
  CampaignIdDto,
  EvaluateQuizDto,
  Lvl1Dto,
  Lvl2Dto,
  MultipleLang,
  QuizDto,
} from './dto/campaign.dto';
import { Campaign, CampaignDocument } from './schema/campaigns.schema';
import {
  CategoriesLv1,
  CategoriesLv1Document,
} from './schema/categories_level1.schema';
import {
  CategoriesLv2,
  CategoriesLv2Document,
} from './schema/categories_level2.schema';
import {
  ParticipateCampaign,
  ParticipateCampaignDocument,
} from './schema/participate.schema';
import { Quiz, QuizDocument } from './schema/quiz.schema';
import { QuizEntries, QuizEntriesDocument } from './schema/quiz_entries.schema';
import { Client, KeyInfo, ThreadID } from '@textile/hub';

/** Service */

@Injectable()
export class CampaignsService {
  value: any;
  constructor(
    @InjectModel(Campaign.name)
    private readonly CampaignModel: Model<CampaignDocument>,
    @InjectModel(CategoriesLv1.name)
    private readonly CategoriesLv1Model: Model<CategoriesLv1Document>,
    @InjectModel(CategoriesLv2.name)
    private readonly CategoriesLv2Model: Model<CategoriesLv2Document>,
    @InjectModel(Quiz.name)
    private readonly QuizModel: Model<QuizDocument>,
    @InjectModel(ParticipateCampaign.name)
    private readonly ParticipateCampaignModel: Model<ParticipateCampaignDocument>,
    @InjectModel(QuizEntries.name)
    private readonly QuizEntriesModel: Model<QuizEntriesDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  //   @Inject('Thread') private readonly Thread,
  // ) {
  //   const { value } = this.Thread;
  //   this.value = value;
  // }

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
        walletAddress: data.walletAddress,
        image: data.image,
        status: 'Approved',
        quizzes: data.quizzes,
      });
      // Add the campaigns to the respective creator
      const { client, threadId } = await this.getThreadDBProvider();
      await this.collectionFromSchema(client, threadId, data);
      return res;
    } catch (e) {
      throw new HttpException('Request Body Invalid', HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Create Quiz
   * params Quizdto
   * @returns Newly created Quiz object
   * */
  async createQuiz(data: QuizDto) {
    await this.QuizModel.create({
      title: data.title,
      questions: data.questions,
    });
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

  /**
   * Get Quiz
   * @body Campaign Id
   * */

  async getQuiz(campaignId: string) {
    return await this.CampaignModel.findOne({ _id: campaignId }).populate(
      'quizzes',
    );
  }

  /**
   * Get all Campaigns
   * @body User object
   * */

  async getAllCampaigns(user) {
    const campaign = await this.CampaignModel.find({});
    const participations = await this.ParticipateCampaignModel.find({
      user: user._id,
    });

    const obj = { campaign: campaign, participations: participations };

    return obj;
  }

  /**Participate in a Campaign
   * @body campaign Id and User object
   */

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

  /**
   * Creating Level 1 English category campaing
   */

  async createEnglishLvl1(data: Lvl1Dto) {
    const res = await this.CategoriesLv1Model.create({
      imageUrl: data.imageUrl,
      title: data.title,
      description: data.description,
      level2: data.level2,
      language: data.language,
    });

    const multipleLangData = { eng: res._id };

    const result = await this.CategoriesLv1Model.findByIdAndUpdate(res._id, {
      multipleLang: multipleLangData,
    });
    return result;
  }

  /**
   * Creating Level 1 Hindi category campaing
   */

  async createHindiLvl1(data: Lvl1Dto, id) {
    const res = await this.CategoriesLv1Model.create({
      imageUrl: data.imageUrl,
      title: data.title,
      description: data.description,
      level2: data.level2,
      language: data.language,
    });

    const multipleLangData = { hn: res._id, eng: id };

    const result = await this.CategoriesLv1Model.findByIdAndUpdate(res._id, {
      multipleLang: multipleLangData,
    });

    await this.CategoriesLv1Model.findByIdAndUpdate(id, {
      multipleLang: multipleLangData,
    });

    return result;
  }

  /**
   * Creating Level 2 category campaign
   */

  async createLvl2(data: Lvl2Dto) {
    const response = await this.CategoriesLv2Model.create({
      title: data.title,
      campaigns: data.campaigns,
    });
    return response.save();
  }

  /**
   * fetching level1 category content without populating
   */

  async getLvl1Content(lang: string) {
    return this.CategoriesLv1Model.find({ language: lang });
  }

  /** fetching level2 category content
   * @body level1 content Id
   *  */

  async getLvl2Content(id: string) {
    return await this.CategoriesLv1Model.findOne({ _id: id })
      .populate('level2')
      .populate({
        path: 'level2',
        populate: {
          path: 'campaigns',
        },
      })
      .lean();
  }

  /**
   * Get level 2 data
   */

  async getAllLvl2() {
    return await this.CategoriesLv2Model.find({}, { title: 1 });
  }

  /**
   * Add campaignId to Level2
   * updating the status of the campaign to Approved or Rejected
   */

  async updateLvl2(data: addCampaigntoLvl2Dto) {
    // Update the status of the campaign

    const res = await this.CampaignModel.findByIdAndUpdate(data.campaignId, {
      status: data.status,
    });
    // push the campaign Id to level2

    if (data.status === 'Approved') {
      await this.CategoriesLv2Model.findByIdAndUpdate(data.level2Id, {
        $push: { campaigns: data.campaignId },
      });
    }
    return res;
  }

  /**
   * Get All Campaigns with pipeline as status
   */

  async getPipelineCampaigns() {
    return await this.CampaignModel.find({});
  }

  async test() {}

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

  collectionFromSchema = async (client, threadID, data: CampaignDto) => {
    // const collection = await client.newCollection(threadID, {
    //   name: 'campaign',
    //   schema: schema,
    // });

    const created = await client.create(threadID, 'campaign', [
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

    const all = await client.find(threadID, 'campaign', {});
    // console.log(created);
    console.log(await all);
  };
}

/**
 * The following code logic is yet to be decided
 */

// async evaluateQuiz(data: EvaluateQuizDto, user) {
//   const { answers, campaignId, campaignPartipationId } = data;
//   const campaign = await this.CampaignModel.findOne({
//     _id: campaignId,
//   }).populate('quizzes');
//   // console.log(campaign);
//   const quizz: any = campaign.quizzes[0];
//   const quizzes = quizz.questions;
//   // console.log(quizzes);

//   if (quizzes.length !== answers.length)
//     throw new HttpException('Request Body Invalid', HttpStatus.BAD_REQUEST);
//   let correctCount = 0;

//   for (let i = 0; i < answers.length; i++) {
//     if (quizzes[i].answerIndex == answers[i]) {
//       correctCount += 1;
//     }
//   }

//   const questionsCount = quizzes.length;
//   let isPassing = false;
//   if ((correctCount / questionsCount) * 100 >= 80) {
//     isPassing = true;
//   }
//   console.log(isPassing);
//   const quiz_entriesData = await this.QuizEntriesModel.create({
//     user: user._id,
//     campaign: campaign._id,
//     quiz: quizz._id,
//     questionsCount,
//     correctCount,
//     isPassing,
//   });
//   // Updating the campaign participation with isComplete True
//   if (quiz_entriesData) {
//     await this.ParticipateCampaignModel.findByIdAndUpdate(
//       { _id: campaignPartipationId },
//       { $set: { isComplete: true } },
//     );
//   }
//   // rewarding Users with Flaq with the flaqReward mentioned in Campaign
//   // await this.RewardsUser(user._id, campaign.flaqReward);
//   //TODO Reward user with the flaq points mentioned in the campaign
//   return quiz_entriesData;
// }
