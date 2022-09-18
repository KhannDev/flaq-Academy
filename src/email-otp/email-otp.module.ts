import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailService } from 'src/utils/email/email.service';
import { IdGeneratorService } from 'src/utils/id-generator/id-generator.service';
import { EmailOtpController } from './email-otp.controller';
import { EmailOtpService } from './email-otp.service';
import { EmailOtp, EmailOtpSchema } from './schema/email-otp.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailOtp.name, schema: EmailOtpSchema },
    ]),
  ],
  controllers: [EmailOtpController],
  providers: [EmailOtpService, EmailService, IdGeneratorService],
})
export class EmailOtpModule {}
