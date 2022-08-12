import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { UserAuthGuard } from 'src/common/usegaurds/userauthguard';
import { CampaignsService } from './campaigns.service';
import {
  AddQuiztoCampaignDto,
  CampaignDto,
  CampaignIdDto,
  EvaluateQuizDto,
  QuizDto,
} from './dto/campaign.dto';

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
  @UseGuards(UserAuthGuard)
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
  @Get('quiz/:id')
  async GetQuiz(@Param('id') id: string) {
    console.log(id);
    const res = await this.campaignservice.GetQuiz(id);
    return res;
  }

  /**Evaluate a Quiz */

  @UseGuards(UserAuthGuard)
  @Post('/Evaluatequiz')
  async EvaluateQuiz(@Body() data: EvaluateQuizDto, @ReqUser() user) {
    return this.campaignservice.evaluateQuiz(data, user);
  }

  /**Participate in a Campaign */
  @UseGuards(UserAuthGuard)
  @Post('/PartipateCampaign')
  async ParticipateCampaign(
    @Body() campaignId: CampaignIdDto,
    @ReqUser() user,
  ) {
    return this.campaignservice.ParticipateCampaign(campaignId, user);
    // return await this.campaignservice.
  }
}
