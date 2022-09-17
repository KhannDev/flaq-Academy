import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Campaign } from 'src/campaigns/schema/campaigns.schema';
import { User } from '../../user/schema/user.schema';

export type CreatorsDocument = Creators & Document;

@Schema({ timestamps: true, collection: 'creators' })
export class Creators {
  @Prop({ type: String })
  username: string;
  @Prop({ type: String })
  email: string;
  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String })
  discordId: string;
  //Array of campaigns created by the user
  @Prop({ type: [{ type: Types.ObjectId, ref: Campaign.name }] })
  campaigns: string[];
}
export const CreatorsSchema = SchemaFactory.createForClass(Creators);
