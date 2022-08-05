import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'Users' })
export class User {
  @Prop({ type: String, unique: true })
  Email: string;
  @Prop({ type: Boolean, default: true })
  IsAllowed: Boolean;
  @Prop({ String })
  DeviceToken: string;
  @Prop({ type: String })
  Password: string;
  /**Assign every user with a unique Referral code */
  @Prop({ type: String })
  ReferralCode: string;
  @Prop({ type: Number })
  RewardMultiplier: Number;
  @Prop({ type: Number })
  FlaqPoints: Number;
}
export const UserSchema = SchemaFactory.createForClass(User);
