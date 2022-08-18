import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'Users' })
export class User {
  @Prop({ type: String, unique: true })
  email: string;
  @Prop({ type: Boolean, default: false })
  isAllowed: boolean;
  @Prop({ String })
  deviceToken: string;
  @Prop({ type: String })
  password: string;
  /**Assign every user with a unique Referral code */
  @Prop({ type: String })
  referralCode: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  referrals: string[];
  @Prop({ type: Number })
  rewardMultiplier: number;
  @Prop({ type: Number, default: 100 })
  flaqPoints: number;
}
export const UserSchema = SchemaFactory.createForClass(User);
