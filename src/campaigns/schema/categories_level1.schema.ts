import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import { Campaign } from './campaigns.schema';
import { CategoriesLv2 } from './categories_level2.schema';

export type CategoriesLv1Document = CategoriesLv1 & Document;

@Schema({ timestamps: true, collection: 'campaign_categories_lv1' })
export class CategoriesLv1 {
  @Prop({ type: String })
  imageUrl: string;
  @Prop({ type: String })
  title: string;
  @Prop({ type: String })
  description: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: CategoriesLv2.name }] })
  level2: string[] | CategoriesLv1[];
}
export const CategoriesLv1Schema = SchemaFactory.createForClass(CategoriesLv1);
