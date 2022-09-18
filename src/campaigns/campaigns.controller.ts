import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiOperation,
  ApiParam,
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
  Lvl1Dto,
  Lvl2Dto,
  QuizDto,
} from './dto/campaign.dto';

/**
 * Controller for handling Campaigns and quizzes
 */

@ApiTags('Campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignservice: CampaignsService) {}

  @ApiOperation({ summary: 'Creating campaigns for admin' })
  @ApiResponse({
    status: 201,
    description: 'Campaign Created Successfully',
  })
  @Post('/create')
  async createCampaigns(@Body() data: CampaignDto) {
    return this.campaignservice.createCampaign(data);
  }

  /** Create Campaigns
   * @body Campaign meta data
   */

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

  /** Create Quiz Template
   * @body quiz title and questions
   */

  @ApiOperation({ summary: 'Create quiz for admin' })
  @ApiResponse({
    status: 201,
    description: 'Quiz Created Successfully',
  })
  @Post('/quiz/template')
  async createQuiz(@Body() data: QuizDto) {
    return this.campaignservice.createQuiz(data);
  }

  /**Adding Quiz to the campaign
   * @body campaign Id
   */

  @ApiOperation({ summary: 'Add quiz to campaign for Admin' })
  @ApiResponse({
    status: 201,
    description: 'Quiz added to Campaign Succesfully Successfully',
  })
  @Post('/addQuiztoCampaign')
  async addQuiztoCampaign(@Body() data: AddQuiztoCampaignDto) {
    return this.campaignservice.addQuiztoCampaign(data);
  }

  /**Get quiz template for a campaign
   * @Param Id
   */

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

  /**Participate in a Campaign
   * @body campaignId
   */

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

  /** Get level1 Content
   * @Query lang
   */

  @Get('/level1')
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get Level 1 Content ' })
  async getLvl1Content(@Query('lang') lang: string) {
    return this.campaignservice.getLvl1Content(lang);
  }

  /** Get level2 and Level3  Content
   * @Param level1 content id
   */

  @Get('/level1/:id')
  @ApiParam({ name: 'id' })
  @UseGuards(UserAuthGuard)
  @ApiOperation({ summary: 'Get Level 2 and Level 3 content ' })
  async getLvl2Content(@Param('id') id) {
    console.log(id);
    return this.campaignservice.getLvl2Content(id);
  }

  /** Create level 1 English Content
   * @body title,description,language,level2 array
   */

  @ApiOperation({ summary: 'Create Level 1 English content  ' })
  @Post('/level1/english')
  async createEnglishLvl1(@Body() data: Lvl1Dto) {
    return this.campaignservice.createEnglishLvl1(data);
  }

  /** Create level 1 hindi Content
   * @body title,description,language,level2 array
   */

  @ApiOperation({ summary: 'Create Level 1 Hindi  content ' })
  @ApiParam({ name: 'id' })
  @Post('/level1/hindi/:id')
  async createHindiLvl1(@Body() data: Lvl1Dto, @Param('id') id) {
    return this.campaignservice.createHindiLvl1(data, id);
  }

  /** Create level 1 English Content
   * @body title, array
   */

  @ApiOperation({ summary: 'Create Level 2 English/Hindi  content ' })
  @Post('/level2')
  async createLv2(@Body() data: Lvl2Dto) {
    console.log(data);
    return this.campaignservice.createLvl2(data);
  }
}

/**Evaluate a Quiz */
// @ApiOperation({ summary: 'Evaluate quiz' })
// @ApiResponse({
//   status: 201,
//   description: 'Quiz Evaluated Successfully',
// })
// @UseGuards(UserAuthGuard)
// @Post('/quiz/evaluate')
// async evaluateQuiz(@Body() data: EvaluateQuizDto, @ReqUser() user) {
//   return this.campaignservice.evaluateQuiz(data, user);
// }
