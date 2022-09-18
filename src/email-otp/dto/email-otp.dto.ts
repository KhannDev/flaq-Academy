import { stringList } from 'aws-sdk/clients/datapipeline';
import { IsEmail, IsString } from 'class-validator';

export class SendOtpDto {
  @IsEmail()
  email: string;
}

export class VerifyOtpDto {
  @IsEmail()
  email: string;
  @IsString()
  otp: string;
}
