import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Articles, Quizzes } from '../dto/campaign.dto';
import { Quiz } from './quiz.schema';

export type CampaignDocument = Campaign & Document;

@Schema({ timestamps: true, collection: 'Campaigns' })
export class Campaign {
  @Prop({ type: String })
  description: string;
  @Prop({ type: String })
  title: string;
  @Prop({ type: String })
  tickerName: string;
  @Prop({ type: String })
  tickerImageUrl: string;
  /**Assign every user with a unique Referral code */
  @Prop({ type: String })
  taskType: string;
  @Prop({ type: String })
  yTVideoUrl: string;
  @Prop({ type: String })
  image: string;
  @Prop({ type: Number })
  requiredFlaq: number;
  @Prop({ type: Number })
  flaqReward: number;
  @Prop({ type: Number })
  airDropUser: number;
  @Prop({ type: Number })
  totalAirDrop: number;
  @Prop({ type: Number })
  currentAirDrop: number;
  @Prop({ type: Articles })
  articles: [] | string;
  @Prop({ type: [{ type: Types.ObjectId, ref: Quiz.name }] })
  quizzes: string[];
}
export const CampaignSchema = SchemaFactory.createForClass(Campaign);
