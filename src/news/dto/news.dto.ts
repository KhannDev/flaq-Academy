import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NewsDto {
  @IsString()
  Image: string;

  @IsString()
  Title: string;

  @IsString()
  description: string;
}
