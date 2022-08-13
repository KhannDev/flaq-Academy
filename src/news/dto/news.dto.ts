import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NewsDto {
  @ApiProperty()
  @IsString()
  Image: string;
  @ApiProperty()
  @IsString()
  Title: string;
  @ApiProperty()
  @IsString()
  description: string;
}
