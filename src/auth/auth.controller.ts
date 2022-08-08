import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserCredentialsdto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { HashingService } from 'src/utils/hashing/hashing.service';
import { JwtsService } from 'src/utils/jwt/jwt.service';
import { AuthService } from './auth.service';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authservice: AuthService,
    private readonly jwt: JwtsService,
    private readonly userservice: UserService,
    private readonly hashingservice: HashingService,
  ) {}

  /**User sign up  */
  @ApiOperation({
    summary: 'User Sign up',
  })
  @Post('signup')
  async signup(@Body() data: UserCredentialsdto) {
    console.log(data.Email);
    const user = await this.userservice.findUserwithEmail(data.Email);

    if (!user) {
      const newUser = this.authservice.CreateUser(data);

      const accessToken = await this.jwt.CreateAccesstoken(data);
      const refreshtokendata = await this.authservice.CreateRefreshToken(data);
      const refreshtoken = await this.jwt.CreateRefreshToken(refreshtokendata);
      return { accessToken, refreshtoken };
    } else {
      throw new HttpException('User already Exists', HttpStatus.CONFLICT);
    }
  }
  /**Login in  */
  @ApiOperation({ summary: 'Login In user' })
  @Post('/login')
  async Login(@Body() data: UserCredentialsdto) {
    const userz = await this.userservice.findUserwithEmail(data.Email);
    if (userz) {
      const matchPassword = await this.hashingservice.compare(
        userz.Password,
        data.Password,
      );

      if (!matchPassword) {
        throw new HttpException(
          `Password is incorrect`,
          HttpStatus.UNAUTHORIZED,
        );
      }
      const accessToken = await this.jwt.CreateAccesstoken(userz);
      const refreshtokendata = await this.authservice.CreateRefreshToken(userz);
      const refreshtoken = await this.jwt.CreateRefreshToken(refreshtokendata);
      return { accessToken, refreshtoken };
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
