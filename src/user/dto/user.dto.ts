import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

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
