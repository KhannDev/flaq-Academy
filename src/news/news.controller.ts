import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { NewsDto } from './dto/news.dto';
import { NewsService } from './news.service';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsservice: NewsService) {}

  @Post('Create')
  async CreateNews(@Body() data: NewsDto) {
    return await this.newsservice.CreateNews(data);
  }
  @Get('Create')
  async GetNews() {
    return await this.newsservice.GetNews();
  }
}
