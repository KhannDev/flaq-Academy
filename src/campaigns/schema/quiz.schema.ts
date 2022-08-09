import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Articles, Questions, QuizDto, Quizzes } from '../dto/campaign.dto';

export type QuizDocument = Quiz & Document;

@Schema({ timestamps: true, collection: 'Quiz_templates' })
export class Quiz {
  @Prop({ type: String })
  Title: string;
  @Prop({ type: Questions })
  Questions: Questions;
}
export const QuizSchema = SchemaFactory.createForClass(Quiz);
