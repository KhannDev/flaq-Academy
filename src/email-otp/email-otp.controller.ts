import { Controller, Get, Post, Body } from '@nestjs/common';

import { EmailService } from 'src/utils/email/email.service';
import { SendOtpDto, VerifyOtpDto } from './dto/email-otp.dto';
import { EmailOtpService } from './email-otp.service';

/**
 * Controller for handling email Otp
 */

@Controller('email-otp')
export class EmailOtpController {
  constructor(
    private readonly emailotpservice: EmailOtpService,
    private readonly emailz: EmailService,
  ) {}

  @Post('/sendOtp')
  async sendOtp(@Body() data: SendOtpDto) {
    return this.emailotpservice.sendOtp(data);
  }

  @Post('/verifyOtp')
  async verifyOtp(@Body() data: VerifyOtpDto) {
    return this.emailotpservice.verifyOtp(data);
  }
}
