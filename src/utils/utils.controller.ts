import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiExcludeController,
  ApiExcludeEndpoint,
  ApiHideProperty,
  ApiTags,
} from '@nestjs/swagger';
import { AwsFileUploadDto } from './dto/utils.dto';
import { UtilsService } from './utils.service';
import { diskStorage } from 'multer';
import { Express } from 'express';

@Controller('utils')
@ApiExcludeController()
export class UtilsController {
  constructor(private readonly utilsservice: UtilsService) {}

  @ApiHideProperty()
  @ApiExcludeEndpoint()
  @Post('/aws/file-upload')
  uploadImages(@Body() data: AwsFileUploadDto) {
    return this.utilsservice.uploadfiles(data.fileName, data.fileExtention);
  }
}
