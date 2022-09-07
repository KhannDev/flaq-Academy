import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Articles, Quizzes, Video } from '../dto/campaign.dto';
import { Quiz } from './quiz.schema';

export enum ContentType {
  Video = 'Video',
  Articles = 'Articles',
  VideoAndArticles = 'VideoAndArticles',
}

enum CampaignStatus {
  Pipeline = 'Pipeline',
  Approved = 'Approved',
}

export type CampaignDocument = Campaign & Document;

@Schema({ timestamps: true, collection: 'campaigns' })
export class Campaign {
  @Prop({ type: String })
  title: string;
  @Prop({ type: String })
  description1: string;
  @Prop({ type: String })
  description2: string;
  @Prop({ type: String })
  description3: string;

  @Prop({ type: Video })
  videos: [];
  // Uploading type of content
  @Prop({ type: String, enum: Object.values(ContentType) })
  contentType: ContentType;
  @Prop({ type: String, enum: Object.values(CampaignStatus) })
  status: CampaignStatus;
  @Prop({ type: String })
  image: string;
  @Prop({ type: [] })
  articles: Articles[];
  @Prop({ type: [{ type: Types.ObjectId, ref: Quiz.name }] })
  quizzes: string[];
}
export const CampaignSchema = SchemaFactory.createForClass(Campaign);
