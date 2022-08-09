import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Articles, Quizzes } from '../dto/campaign.dto';
import { Quiz } from './quiz.schema';

export type CampaignDocument = Campaign & Document;

@Schema({ timestamps: true, collection: 'Campaigns' })
export class Campaign {
  @Prop({ type: String })
  Description: string;
  @Prop({ type: String })
  Title: string;
  @Prop({ type: String })
  TickerName: string;
  @Prop({ type: String })
  TickerImageUrl: string;
  /**Assign every user with a unique Referral code */
  @Prop({ type: String })
  TaskType: string;
  @Prop({ type: String })
  YTVideoUrl: string;
  @Prop({ type: String })
  Image: string;
  @Prop({ type: Number })
  RequiredFlaq: number;
  @Prop({ type: Number })
  FlaqReward: number;
  @Prop({ type: Number })
  AirDropUser: number;
  @Prop({ type: Number })
  TotalAirDrop: number;
  @Prop({ type: Number })
  CurrentAirDrop: number;
  @Prop({ type: Articles })
  Articles: [] | string;
  @Prop({ type: [{ type: Types.ObjectId, ref: Quiz.name }] })
  Quizzes: string[];
}
export const CampaignSchema = SchemaFactory.createForClass(Campaign);
