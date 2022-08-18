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
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsString()
  title: string;
  @ApiProperty()
  @IsString()
  tickerName: string;
  @ApiProperty()
  @IsString()
  tickerImageUrl: string;
  @ApiProperty()
  @IsString()
  taskType: string;
  @ApiProperty()
  @IsString()
  ytVideoUrl: string;
  @ApiProperty()
  @IsString()
  image: string;
  @ApiProperty()
  @IsNotEmpty()
  requiredFlaq: number;
  @ApiProperty()
  @IsNotEmpty()
  flaqReward: number;
  @ApiProperty()
  @IsNotEmpty()
  airDropUser: number;
  @ApiProperty()
  @IsNotEmpty()
  totalAirDrop: number;
  @ApiProperty()
  @IsNotEmpty()
  currentAirDrop: number;
  @ApiProperty()
  articles: Articles[];
  @ApiProperty()
  @IsNotEmpty()
  quizzes: string[];
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
  questions: Questions;
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
  @ApiProperty()
  quizTemplateId: string;
}
