import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Articles, Questions, QuizDto, Quizzes } from '../dto/campaign.dto';
import { Campaign } from './campaigns.schema';

export type QuizDocument = Quiz & Document;

@Schema({ timestamps: true, collection: 'quiz_templates' })
export class Quiz {
  @Prop({ type: String })
  title: string;
  @Prop({ type: [] })
  questions: Questions[];
}
export const QuizSchema = SchemaFactory.createForClass(Quiz);
