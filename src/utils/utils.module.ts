import { Module } from '@nestjs/common';
import { AwsS3Service } from './aws/aws.service';
import { UtilsController } from './utils.controller';
import { UtilsService } from './utils.service';

@Module({
  controllers: [UtilsController],
  providers: [UtilsService, AwsS3Service],
})
export class UtilsModule {}
