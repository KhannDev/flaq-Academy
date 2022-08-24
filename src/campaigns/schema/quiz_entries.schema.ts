import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../../user/schema/user.schema';
import { Articles, Questions, QuizDto, Quizzes } from '../dto/campaign.dto';
import { Campaign } from './campaigns.schema';
import { Quiz } from './quiz.schema';

export type QuizEntriesDocument = QuizEntries & Document;

@Schema({ timestamps: true, collection: 'quiz_templates' })
export class QuizEntries {
  @Prop({ type: Boolean })
  isPassing: boolean;
  @Prop({ type: Number })
  questionsCount: number;
  @Prop({ type: Number })
  correctCount: number;
  @Prop({ type: Types.ObjectId, ref: Campaign.name })
  campaign: string;
  @Prop({ type: Types.ObjectId, ref: User.name })
  user: string;
  @Prop({ type: Types.ObjectId, ref: Quiz.name })
  quiz: string;
}
export const QuizEntriesSchema = SchemaFactory.createForClass(QuizEntries);
