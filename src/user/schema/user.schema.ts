import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'Users' })
export class User {
  @Prop({ type: String, unique: true })
  Email: string;
  @Prop({ type: Boolean, default: false })
  IsAllowed: boolean;
  @Prop({ String })
  DeviceToken: string;
  @Prop({ type: String })
  Password: string;
  /**Assign every user with a unique Referral code */
  @Prop({ type: String })
  ReferralCode: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  Referrals: string[];
  @Prop({ type: Number })
  RewardMultiplier: number;
  @Prop({ type: Number, default: 100 })
  FlaqPoints: number;
}
export const UserSchema = SchemaFactory.createForClass(User);
