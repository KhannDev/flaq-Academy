import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NewsDto {
  @IsString()
  image: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  url: string;
}
