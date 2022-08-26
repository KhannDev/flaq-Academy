import { IsString } from 'class-validator';

export class AwsFileUploadDto {
  @IsString()
  fileName: string;
  @IsString()
  fileExtention: string;
}
