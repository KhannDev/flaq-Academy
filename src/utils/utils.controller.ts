import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UtilsService } from './utils.service';
@ApiTags('Utils')
@Controller('utils')
export class UtilsController {
  constructor(private readonly utilsservice: UtilsService) {}

  @Post()
  uploadImages(fileName, fileExtention) {
    return this.utilsservice.uploadfiles('test', 'png');
  }
}
