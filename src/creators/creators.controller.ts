import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CampaignDto } from 'src/campaigns/dto/campaign.dto';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { CreatorAuthGuard } from 'src/common/usegaurds/creator-auth.guard';
import { CreatorsService } from './creators.service';
import { RefreshTokenDto } from './dto/creators.dto';

/**
 * Controller to handle Creators features
 */

@ApiTags('Creators')
@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsservice: CreatorsService) {}

  /**
   * create a campaign for creators( Setting the status to Pipeline,
   *  and adding the campaign Id to the creator)
   *  */
  @ApiOperation({
    summary: 'Create Campaign for the User  ',
  })
  @UseGuards(CreatorAuthGuard)
  @Post('/campaign/create')
  async createCampaign(@Body() data: CampaignDto, @ReqUser() user) {
    return await this.creatorsservice.createCampaign(data, user);
  }

  /**
   * Fetch all the campaigns for the creator
   *  */

  @ApiOperation({
    summary: 'Get All Campaings for the user ',
  })
  @UseGuards(CreatorAuthGuard)
  @Get('campaigns')
  async getCampaigns(@ReqUser() user) {
    return this.creatorsservice.getCampaigns(user);
  }

  /**
   * Fetch creator meta data
   */

  @ApiOperation({
    summary: 'Get Creators Meta Data ',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully Creators Meta Data',
  })
  @UseGuards(CreatorAuthGuard)
  @Get('Profile')
  async creatorProfile(@ReqUser() req) {
    return await this.creatorsservice.findCreatorbyEmail(req.email);
  }

  /**
   * Refresh Access token for the User
   */
  @ApiOperation({
    summary: 'Refresh Access Token ',
  })
  @ApiResponse({
    status: 201,
    description: 'The User is Logged in  Successfully',
  })
  @Post('token/refresh')
  async RefreshAccessToken(@Body() data: RefreshTokenDto) {
    return await this.creatorsservice.refreshDiscordAccessToken(
      data.refreshToken,
    );
  }
}
