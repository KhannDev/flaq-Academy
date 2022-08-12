import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { Articles, Questions, QuizDto, Quizzes } from '../dto/campaign.dto';
import { Campaign } from './campaigns.schema';
import { Quiz } from './quiz.schema';

export type QuizEntriesDocument = QuizEntries & Document;

@Schema({ timestamps: true, collection: 'Quiz_templates' })
export class QuizEntries {
  @Prop({ type: Boolean })
  IsPassing: Boolean;
  @Prop({ type: Number })
  QuestionsCount: Number;
  @Prop({ type: Number })
  CorrectCount: Number;
  @Prop({ type: Types.ObjectId, ref: Campaign.name })
  Campaign: string;
  @Prop({ type: Types.ObjectId, ref: User.name })
  User: string;
  @Prop({ type: Types.ObjectId, ref: Quiz.name })
  Quiz: string;
}
export const QuizEntriesSchema = SchemaFactory.createForClass(QuizEntries);
