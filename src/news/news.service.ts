import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { News, NewsDocument } from './schema/news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private readonly NewsModel: Model<NewsDocument>,
  ) {}

  async createNews(data) {
    const { title, description, image } = data;
    return await this.NewsModel.create({
      title,
      description,
      image,
    });
  }

  async getNews() {
    return this.NewsModel.find().sort({ createdAt: -1 });
  }
}
