import { Injectable } from '@nestjs/common';
import { AwsS3Service } from './aws/aws.service';

@Injectable()
export class UtilsService {
  constructor(private readonly awsservice: AwsS3Service) {}

  async uploadfiles(filename: string, fileExtension: string) {
    return await this.awsservice.getSignedUrl(filename, fileExtension);
  }
}
