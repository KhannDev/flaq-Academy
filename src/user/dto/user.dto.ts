import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserCredentialsdto {
  @ApiProperty()
  @IsEmail()
  Email: string;
  @ApiProperty()
  @IsNotEmpty()
  Password: string;
  @ApiProperty()
  @IsNotEmpty()
  DeviceToken: string;
}
export class UserReferralDto {
  @ApiProperty()
  RefferalCode: string;
}
export class refreshTokenDto {
  @ApiProperty()
  @IsString()
  RefreshToken: string;
}
