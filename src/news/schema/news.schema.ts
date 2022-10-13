import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type NewsDocument = News & Document;

@Schema({ timestamps: true, collection: 'news' })
export class News {
  @Prop({ type: String })
  title: string;
  @Prop({ type: String })
  description: string;
  @Prop({ type: String })
  image: string;
  @Prop({ type: String })
  url: string;
}
export const NewsSchema = SchemaFactory.createForClass(News);
