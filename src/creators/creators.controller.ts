import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CampaignDto } from 'src/campaigns/dto/campaign.dto';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { CreatorAuthGuard } from 'src/common/usegaurds/creator-auth.guard';
import { CreatorsService } from './creators.service';
import { RefreshTokenDto } from './dto/creators.dto';

@ApiTags('Creators')
@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsservice: CreatorsService) {}

  // create a campaign for creators( Set the status to Pipeline, and add the campaign Id to the creator)
  @ApiOperation({
    summary: 'Create Campaign for the User  ',
  })
  @UseGuards(CreatorAuthGuard)
  @Post('/campaign/create')
  async createCampaign(@Body() data: CampaignDto, @ReqUser() user) {
    return await this.creatorsservice.createCampaign(data, user);
  }

  // Fetch all the campaigns for the creator
  @ApiOperation({
    summary: 'Get All Campaings for the user ',
  })
  @UseGuards(CreatorAuthGuard)
  @Get('campaigns')
  async getCampaigns(@ReqUser() user) {
    return this.creatorsservice.getCampaigns(user);
  }

  //Fetch creator meta data
  @ApiOperation({
    summary: 'Get Creators Meta Data ',
  })
  @UseGuards(CreatorAuthGuard)
  @Get('Profile')
  async creatorProfile(@ReqUser() req) {
    console.log(req.email);
    return await this.creatorsservice.findCreatorbyEmail(req.email);
  }
  // @UseGuards(CreatorAuthGuard)
  @ApiOperation({
    summary: 'Refresh Access Token ',
  })
  @Post('token/refresh')
  async RefreshAccessToken(@Body() data: RefreshTokenDto) {
    return await this.creatorsservice.RefreshDiscordAccessToken(
      data.RefreshToken,
    );
  }
}
