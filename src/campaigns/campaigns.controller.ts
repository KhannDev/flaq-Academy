import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { ReqUser } from '../common/decorators/req-user.decorator';
import { UserAuthGuard } from '../common/usegaurds/user-auth.guard';
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

  @Post('/createCampaign')
  async createCampaigns(@Body() data: CampaignDto) {
    return this.campaignservice.createCampaign(data);
  }
  /** Create Campaigns  */
  @ApiBasicAuth()
  @UseGuards(UserAuthGuard)
  @Get('/allCampaigns')
  async getAllCampaigns() {
    return await this.campaignservice.getAllCampaigns();
  }

  /** Create Quiz Template  */
  @Post('/quiz/template')
  async createQuiz(@Body() data: QuizDto) {
    return this.campaignservice.createQuiz(data);
  }

  /**Adding Quiz to the campaign */
  @Post('/addQuiztoCampaign')
  async addQuiztoCampaign(@Body() data: AddQuiztoCampaignDto) {
    return this.campaignservice.addQuiztoCampaign(data);
  }

  /**Get quiz template for a campaign */
  @Get('quiz/:id')
  async getQuiz(@Param('id') id: string) {
    console.log(id);
    const res = await this.campaignservice.getQuiz(id);
    return res;
  }

  /**Evaluate a Quiz */

  @UseGuards(UserAuthGuard)
  @Post('/evaluateQuiz')
  async evaluateQuiz(@Body() data: EvaluateQuizDto, @ReqUser() user) {
    return this.campaignservice.evaluateQuiz(data, user);
  }

  /**Participate in a Campaign */
  @UseGuards(UserAuthGuard)
  @Post('/partipateCampaign')
  async participateCampaign(
    @Body() campaignId: CampaignIdDto,
    @ReqUser() user,
  ) {
    return this.campaignservice.participateCampaign(campaignId, user);
    // return await this.campaignservice.
  }
}
