import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { get } from 'http';
import { User } from '../user/schema/user.schema';
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
  @ApiOperation({ summary: 'Creating campaigns for admin' })
  @ApiResponse({
    status: 201,
    description: 'Campaign Created Successfully',
  })
  @Post('/create')
  async createCampaigns(@Body() data: CampaignDto) {
    return this.campaignservice.createCampaign(data);
  }

  /** Create Campaigns  */
  @ApiOperation({ summary: 'Get all campaigns and participated campaigns' })
  @ApiResponse({
    status: 201,
    description: 'Successfully fetched all Campaigns',
  })
  @UseGuards(UserAuthGuard)
  @Get('all')
  async getAllCampaigns(@ReqUser() user: User) {
    return await this.campaignservice.getAllCampaigns(user);
  }

  /** Create Quiz Template  */
  @ApiOperation({ summary: 'Create quiz for admin' })
  @ApiResponse({
    status: 201,
    description: 'Quiz Created Successfully',
  })
  @Post('/quiz/template')
  async createQuiz(@Body() data: QuizDto) {
    return this.campaignservice.createQuiz(data);
  }

  /**Adding Quiz to the campaign */
  @ApiOperation({ summary: 'Add quiz to campaign for Admin' })
  @ApiResponse({
    status: 201,
    description: 'Quiz added to Campaign Succesfully Successfully',
  })
  @Post('/addQuiztoCampaign')
  async addQuiztoCampaign(@Body() data: AddQuiztoCampaignDto) {
    return this.campaignservice.addQuiztoCampaign(data);
  }

  /**Get quiz template for a campaign */
  @ApiOperation({ summary: 'Get quiz for a particular campaign' })
  @ApiResponse({
    status: 201,
    description: 'Successfully fetched Quiz ',
  })
  @Get('quiz/:id')
  async getQuiz(@Param('id') id: string) {
    console.log(id);
    const res = await this.campaignservice.getQuiz(id);
    return res;
  }

  /**Evaluate a Quiz */
  @ApiOperation({ summary: 'Evaluate quiz' })
  @ApiResponse({
    status: 201,
    description: 'Quiz Evaluated Successfully',
  })
  @UseGuards(UserAuthGuard)
  @Post('/quiz/evaluate')
  async evaluateQuiz(@Body() data: EvaluateQuizDto, @ReqUser() user) {
    return this.campaignservice.evaluateQuiz(data, user);
  }

  /**Participate in a Campaign */
  @ApiOperation({ summary: 'Participating a particular campaign' })
  @ApiResponse({
    status: 201,
    description: ' User Particapted in the particular campaign',
  })
  @UseGuards(UserAuthGuard)
  @Post('/partipate')
  async participateCampaign(
    @Body() campaignId: CampaignIdDto,
    @ReqUser() user,
  ) {
    return this.campaignservice.participateCampaign(campaignId, user);
  }
}
