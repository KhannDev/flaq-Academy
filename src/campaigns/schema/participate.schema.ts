import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Articles, Questions, QuizDto, Quizzes } from '../dto/campaign.dto';
import { Campaign } from './campaigns.schema';

export type ParticipateCampaignDocument = ParticipateCampaign & Document;

@Schema({ timestamps: true, collection: 'ParticipateCampaign' })
export class ParticipateCampaign {
  @Prop({ type: Boolean, default: false })
  isComplete: boolean;
  @Prop({ type: Number })
  flaqSpent: number;
  @Prop({ type: Types.ObjectId, ref: Campaign.name })
  campaign: string;
  @Prop({ type: Types.ObjectId, ref: User.name })
  user: string;
}
export const ParticipateCampaignSchema =
  SchemaFactory.createForClass(ParticipateCampaign);
