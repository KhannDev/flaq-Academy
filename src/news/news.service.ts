import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsDto } from './dto/news.dto';

import { News, NewsDocument } from './schema/news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private readonly NewsModel: Model<NewsDocument>,
  ) {}

  /**
   * create news
   * @param data
   */
  async createNews(data: NewsDto) {
    const { title, description, image, url } = data;
    return await this.NewsModel.create({
      title,
      description,
      image,
      url,
    });
  }

  /**
   *
   * @returns All news
   */

  async getNews() {
    return this.NewsModel.find().sort({ createdAt: -1 });
  }
}
