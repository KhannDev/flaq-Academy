import { Module } from '@nestjs/common';
import { AwsS3Service } from './aws/aws.service';
import { UtilsController } from './utils.controller';
import { UtilsService } from './utils.service';
import { EmailService } from './email/email.service';

@Module({
  controllers: [UtilsController],
  providers: [UtilsService, AwsS3Service, EmailService],
})
export class UtilsModule {}
