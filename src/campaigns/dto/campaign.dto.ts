import { ApiProperty } from '@nestjs/swagger';
import { isNotEmpty, IsNotEmpty, isString, IsString } from 'class-validator';

export class Articles {
  @ApiProperty()
  url: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  iconUrl: string;
}
export class Quizzes {
  ids: [];
}
export class CampaignDto {
  @IsString()
  description: string;

  @IsString()
  title: string;

  @IsString()
  image: string;
  contentType: string;

  yTVideoUrl?: string;

  articles?: Articles[];

  quizzes?: string[];
}
export class Questions {
  @IsString()
  question: string;
  @IsString()
  description: string;

  answerIndex: number;

  options: string[];
}
export class QuizDto {
  @IsString()
  title: string;

  @IsNotEmpty()
  questions: Questions[];
}
export class AddQuiztoCampaignDto {
  @IsString()
  campaignId: string;

  @IsString()
  quizId: string;
}
export class CampaignIdDto {
  @IsString()
  campaignId: string;
}

export class EvaluateQuizDto {
  answers: string[];
  @ApiProperty()
  campaignPartipationId: string;
  @ApiProperty()
  campaignId: string;
}
