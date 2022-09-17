import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { MultipleLang } from '../dto/campaign.dto';

import { Campaign } from './campaigns.schema';
import { CategoriesLv2 } from './categories_level2.schema';

export enum language {
  english = 'eng',
  hindi = 'hn',
}

export type CategoriesLv1Document = CategoriesLv1 & Document;

@Schema({ timestamps: true, collection: 'campaign_categories_lv1' })
export class CategoriesLv1 {
  // Image Url for the campaign
  @Prop({ type: String })
  imageUrl: string;
  // title of the campaign
  @Prop({ type: String })
  title: string;
  // description of the campaign
  @Prop({ type: String })
  description: string;
  // Array of the level 2 content
  @Prop({ type: [{ type: Types.ObjectId, ref: CategoriesLv2.name }] })
  level2: string[] | CategoriesLv2[];
  // Language of the campaign
  @Prop({ type: String, enum: Object.values(language) })
  language: string;
  @Prop({
    type: {
      eng: { type: Types.ObjectId, ref: CategoriesLv1.name },
      hn: { type: Types.ObjectId, ref: CategoriesLv1.name },
    },
  })
  multipleLang: MultipleLang;
}
export const CategoriesLv1Schema = SchemaFactory.createForClass(CategoriesLv1);
