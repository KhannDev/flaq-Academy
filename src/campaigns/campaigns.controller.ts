import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { UserAuthGuard } from 'src/common/usegaurds/userauthguard';
import { CampaignsService } from './campaigns.service';
import { AddQuiztoCampaignDto, CampaignDto, QuizDto } from './dto/campaign.dto';

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignservice: CampaignsService) {}
  // @UseGuards(UserAuthGuard)

  @Post('/CreateCampaign')
  async CreateCampaigns(@Body() data: CampaignDto) {
    return this.campaignservice.CreateCampaign(data);
  }
  /** Create Campaigns  */
  @Get('/Allcampaigns')
  async GetAllCampaigns() {
    return await this.campaignservice.GetAllCampaigns();
  }

  /** Create Quiz Template  */
  @Post('/quiz/template')
  async CreateQuiz(@Body() data: QuizDto) {
    return this.campaignservice.CreateQuiz(data);
  }

  /**Adding Quiz to the campaign */
  @Post('/AddQuiztoCampaign')
  async AddQuiztoCampaign(@Body() data: AddQuiztoCampaignDto) {
    return this.campaignservice.AddQuiztoCampaign(data);
  }

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
