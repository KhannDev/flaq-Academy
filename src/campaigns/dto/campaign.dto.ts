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
export class RefreshTokenDto {
  refreshToken: string;
}
export class CampaignDto {
  @IsString()
  description1: string;
  @IsString()
  description2?: string;
  @IsString()
  description3?: string;

  @IsString()
  title: string;

  @IsString()
  image: string;
  contentType: string;

  videos?: Video[];

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

  campaignPartipationId: string;

  campaignId: string;
}

export class Video {
  Url: string;
  Desc: string;
  title: string;
}

export class Lvl1Dto {
  imageUrl: string;
  title: string;
  description: string;
  level2: string[];
}
export class Lvl2Dto {
  title: string;
  campaigns: string[];
}
