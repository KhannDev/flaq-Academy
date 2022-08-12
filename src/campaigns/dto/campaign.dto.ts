import { ApiProperty } from '@nestjs/swagger';
import { isNotEmpty, IsNotEmpty, isString, IsString } from 'class-validator';

export class Articles {
  @ApiProperty()
  Url: string;
  @ApiProperty()
  Title: string;
  @ApiProperty()
  IconUrl: string;
}
export class Quizzes {
  Ids: [];
}
export class CampaignDto {
  @ApiProperty()
  @IsString()
  Description: string;
  @ApiProperty()
  @IsString()
  Title: string;
  @ApiProperty()
  @IsString()
  TickerName: string;
  @ApiProperty()
  @IsString()
  TickerImageUrl: string;
  @ApiProperty()
  @IsString()
  TaskType: string;
  @ApiProperty()
  @IsString()
  YtVideoUrl: string;
  @ApiProperty()
  @IsString()
  Image: string;
  @ApiProperty()
  @IsNotEmpty()
  RequiredFlaq: Number;
  @ApiProperty()
  @IsNotEmpty()
  FlaqReward: Number;
  @ApiProperty()
  @IsNotEmpty()
  AirDropUser: Number;
  @ApiProperty()
  @IsNotEmpty()
  TotalAirDrop: Number;
  @ApiProperty()
  @IsNotEmpty()
  CurrentAirDrop: Number;
  @ApiProperty()
  Articles: Articles[];
  @ApiProperty()
  @IsNotEmpty()
  Quizzes: string[];
}
export class Questions {
  @ApiProperty()
  Question: string;
  @ApiProperty()
  Description: string;
  @ApiProperty()
  AnswerIndex: Number;
  @ApiProperty()
  Options: string[];
}
export class QuizDto {
  @ApiProperty()
  @IsString()
  Title: string;
  @ApiProperty()
  @IsNotEmpty()
  Questions: Questions;
}
export class AddQuiztoCampaignDto {
  @ApiProperty()
  @IsString()
  CampaignId: string;
  @ApiProperty()
  @IsString()
  QuizId: string;
}
export class CampaignIdDto {
  @IsString()
  @ApiProperty()
  campaignId: string;
}

export class EvaluateQuizDto {
  @ApiProperty()
  Answers: string[];
  @ApiProperty()
  campaignPartipationId: string;
  @ApiProperty()
  campaignId: string;
  @ApiProperty()
  quizTemplateId: string;
}
