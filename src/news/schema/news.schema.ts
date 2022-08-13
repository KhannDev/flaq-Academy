import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type NewsDocument = News & Document;

@Schema({ timestamps: true, collection: 'News' })
export class News {
  @Prop({ type: String })
  Title: string;
  @Prop({ type: String })
  Description: string;
  @Prop({ type: String })
  Image: string;
}
export const NewsSchema = SchemaFactory.createForClass(News);
