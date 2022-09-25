import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  isNotEmpty,
  IsNotEmpty,
  isString,
  IsString,
} from 'class-validator';

export class Articles {
  url: string;

  title: string;

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

  description2?: string;

  description3?: string;

  @IsString()
  title: string;

  @IsString()
  image: string;
  @IsString()
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
  @IsMongoId()
  campaignId: string;
}

export class EvaluateQuizDto {
  answers: string[];
  @IsMongoId()
  campaignPartipationId: string;
  @IsMongoId()
  campaignId: string;
}

export class Video {
  url: string;
  desc: string;
  title: string;
}

export class Lvl1Dto {
  imageUrl: string;
  title: string;
  description: string;
  @IsMongoId({ each: true })
  level2: string[];
  language: string;
}
export class Lvl2Dto {
  title: string;
  @IsMongoId({ each: true })
  campaigns: string[];
}
export class MultipleLang {
  eng: string;
  hn: string;
}
