import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Campaign,
  CampaignDocument,
} from 'src/campaigns/schema/campaigns.schema';
import {
  CategoriesLv2,
  CategoriesLv2Document,
} from 'src/campaigns/schema/categories_level2.schema';
import { addCampaigntoLvl2Dto } from './dto/admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(CategoriesLv2.name)
    private readonly CampaignLvl2Model: Model<CategoriesLv2Document>,
    @InjectModel(Campaign.name)
    private readonly campaignModel: Model<CampaignDocument>,
  ) {}

  /**
   * get Level 2 data
   */

  async getLvl2() {
    return await this.CampaignLvl2Model.find({}, { title: 1 });
  }

  /**
   * Add campaignId to Level2
   * updating the status of the campaign to Approved or Rejected
   */

  async updateLvl2(data: addCampaigntoLvl2Dto) {
    //Update the status of the campaign

    const res = await this.campaignModel.findByIdAndUpdate(data.campaignId, {
      status: data.status,
    });
    // push the campaign Id to level2

    if (data.status === 'Approved') {
      await this.CampaignLvl2Model.findByIdAndUpdate(data.level2Id, {
        $push: { campaigns: data.campaignId },
      });
    }
  }

  /**
   * Get All Campaigns with pipeline as status
   */

  async getPipelineCampaigns() {
    return await this.campaignModel.find({ status: 'Pipeline' });
  }
}
