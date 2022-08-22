import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';

export type RefreshTokenDocument = RefreshToken & Document;

@Schema({ timestamps: true, collection: 'refreshtokens' })
export class RefreshToken {
  @Prop({ type: Types.ObjectId, ref: User.name })
  userId: string;
  @Prop({ type: Boolean, default: false })
  is_revoked: boolean;
  @Prop({ String })
  expires: string;
}
export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
