import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Campaign } from 'src/campaigns/schema/campaigns.schema';
import { User } from '../../user/schema/user.schema';

export type EmailOtpDocument = EmailOtp & Document;

@Schema({ timestamps: true, collection: 'email_otp' })
export class EmailOtp {
  //one time password
  @Prop({ type: String })
  otp: string;
  // email id of the user
  @Prop({ type: String })
  email: string;
  // unsuccesful attempt made
  @Prop({ type: String })
  attempts: string;
}
export const EmailOtpSchema = SchemaFactory.createForClass(EmailOtp);
