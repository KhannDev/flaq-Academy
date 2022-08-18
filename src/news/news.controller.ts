import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { NewsDto } from './dto/news.dto';
import { NewsService } from './news.service';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsservice: NewsService) {}

  @Post('/create')
  async createNews(@Body() data: NewsDto) {
    return await this.newsservice.createNews(data);
  }
  @Get('/getNews')
  async getNews() {
    return await this.newsservice.getNews();
  }
}
