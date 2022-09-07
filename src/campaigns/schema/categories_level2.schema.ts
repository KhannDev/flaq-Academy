import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Articles, Questions, QuizDto, Quizzes } from '../dto/campaign.dto';
import { Campaign } from './campaigns.schema';

export type CategoriesLvtwoDocument = CategoriesLv2 & Document;

@Schema({ timestamps: true, collection: 'campaign_categories_lv2' })
export class CategoriesLv2 {
  @Prop({ type: String })
  title: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: Campaign.name }] })
  Campaigns: string;
}
export const CategoriesLv2Schema = SchemaFactory.createForClass(CategoriesLv2);
