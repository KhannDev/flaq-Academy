import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';

export type ContributorDocument = Contributor & Document;

@Schema({ timestamps: true, collection: 'contributor' })
export class Contributor {
  @Prop({ type: String })
  username: string;
  @Prop({ type: String })
  email: string;
  @Prop({ type: String })
  avator: string;
  @Prop({ type: String })
  discordId: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  campaign: string[];
}
export const ContributorSchema = SchemaFactory.createForClass(Contributor);
