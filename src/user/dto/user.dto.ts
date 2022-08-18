import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserCredentialsDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  deviceToken: string;
}
export class UserReferralDto {
  refferalCode: string;
}
export class RefreshTokenDto {
  @IsString()
  refreshToken: string;
}
