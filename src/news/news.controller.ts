import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NewsDto } from './dto/news.dto';
import { NewsService } from './news.service';

/** Controller for handling the news  */

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsservice: NewsService) {}

  /**
   * Create News
   */

  @ApiOperation({ summary: 'Create News' })
  @ApiResponse({
    status: 201,
    description: 'News created Successfully',
  })
  @Post('/create')
  async createNews(@Body() data: NewsDto) {
    return await this.newsservice.createNews(data);
  }

  /**
   * Get All news in sorted manner
   */

  @ApiOperation({ summary: 'Login In user' })
  @ApiResponse({
    status: 201,
    description: 'The User is Logged in  Successfully',
  })
  @Get('/getNews')
  async getNews() {
    return await this.newsservice.getNews();
  }
}
