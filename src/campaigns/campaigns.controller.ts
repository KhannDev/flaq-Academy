import { Controller, Post, UseGuards } from '@nestjs/common';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { UserAuthGuard } from 'src/common/usegaurds/userauthguard';
import { CampaignsService } from './campaigns.service';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignservice: CampaignsService) {}
  // @UseGuards(UserAuthGuard)
  @Post()
  async GetAllCampaigns(@ReqUser() user) {
    console.log(user);
  }
  /** Create Campaigns  */
  @Post('/campaigns')
  async CreateCampaigns() {
    return;
  }

  /** Create Quiz Template  */
  @Post('/quiz/template')
  async Createquiz() {}

  /**Adding Quiz to the campaign */
  @Post('/quiz')
  async AddQuiztoCampaign() {}

  /**Get quiz template for a campaign */
  @Post('/quiz')
  async GetQuiz() {}

  /**Evaluate a Quiz */
  @Post('/quiz')
  async EvaluateQuiz() {}

  /**Participate in a Campaign */
  @Post('/quiz')
  async ParticipateCampaign() {}
}
