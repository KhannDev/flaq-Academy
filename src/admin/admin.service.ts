import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CampaignsService } from 'src/campaigns/campaigns.service';
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
  constructor(private readonly campaignservice: CampaignsService) {}

  /**
   * get Level 2 data
   */

  async getLvl2() {
    return await this.campaignservice.getAllLvl2();
  }

  /**
   * Add campaignId to Level2
   * updating the status of the campaign to Approved or Rejected
   */

  async updateLvl2(data: addCampaigntoLvl2Dto) {
    return await this.campaignservice.updateLvl2(data);
  }

  /**
   * Get All Campaigns with pipeline as status
   */

  async getPipelineCampaigns() {
    return await this.campaignservice.getPipelineCampaigns();
  }
}
