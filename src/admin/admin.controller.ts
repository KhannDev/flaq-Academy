import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/common/usegaurds/admin-auth.guard';
import { AdminService } from './admin.service';
import { addCampaigntoLvl2Dto } from './dto/admin.dto';
/**
 * Controller for handling Admin
 */
@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminservice: AdminService) {}

  /**
   * Get Level 2
   */

  @ApiOperation({ summary: 'Get all level2 content titles' })
  @ApiResponse({
    status: 201,
    description: 'Successfully fetched all level2',
  })
  @UseGuards(AdminAuthGuard)
  @Get('level2')
  async getLvl2() {
    return await this.adminservice.getLvl2();
  }

  /**
   * Add Campaign to level 2
   * if the status is Approved
   */

  @ApiOperation({ summary: 'Adding campaign to level2 ' })
  @ApiResponse({
    status: 201,
    description: 'Successfully Updated the Status',
  })
  @UseGuards(AdminAuthGuard)
  @Post('level2')
  async addCampaigntoLvl2(@Body() data: addCampaigntoLvl2Dto) {
    return await this.adminservice.updateLvl2(data);
  }

  /**
   * Get All Campaigns with pipeline as status
   */

  @ApiOperation({ summary: 'Get All Campaigns with pipeline as status' })
  @ApiResponse({
    status: 201,
    description: 'Successfully fetched all Campaigns',
  })
  @UseGuards(AdminAuthGuard)
  @Get('/campaigns')
  async getPipelineCampaigns() {
    return await this.adminservice.getPipelineCampaigns();
  }
}
