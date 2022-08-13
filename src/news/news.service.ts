import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News, NewsDocument } from './schema/news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private readonly NewsModel: Model<NewsDocument>,
  ) {}

  async CreateNews(data) {
    const { Title, Description, Image } = data;
    return await this.NewsModel.create({
      Title,
      Description,
      Image,
    });
  }

  async GetNews() {
    return this.NewsModel.find().sort({ createdAt: -1 });
  }
}
