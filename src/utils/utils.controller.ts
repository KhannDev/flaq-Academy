import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AwsFileUploadDto } from './dto/utils.dto';
import { UtilsService } from './utils.service';
@ApiTags('Utils')
@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsservice: UtilsService) {}

  @Post()
  uploadImages(@Body() data: AwsFileUploadDto) {
    return this.utilsservice.uploadfiles(data.fileName, data.fileExtention);
  }
}
