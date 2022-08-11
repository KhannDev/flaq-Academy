import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { UserAuthGuard } from 'src/common/usegaurds/userauthguard';
import { refreshTokenDto, UserCredentialsdto } from 'src/user/dto/user.dto';
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
  async signup(
    @Body() data: UserCredentialsdto,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(data.Email);
    const user = await this.userservice.findUserwithEmail(data.Email);

    if (!user) {
      const newUser = await this.authservice.CreateUser(data);
      console.log(newUser);
      //Generate Access token for the user
      const accessToken = await this.jwt.CreateAccesstoken(newUser.Email);
      console.log(accessToken);
      response.cookie('x-access-token', accessToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure: false,
      });
      //Generate Refresh token for the user
      const refreshtokendata = await this.authservice.CreateRefreshToken(
        newUser,
      );
      const refreshtoken = await this.jwt.CreateRefreshToken(refreshtokendata);
      response.cookie('x-refresh-token', refreshtoken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
      });
      return { accessToken, refreshtoken };
      /** Response to store access and refresh token in cookies */
    } else {
      throw new HttpException('User already Exists', HttpStatus.CONFLICT);
    }
  }
  /**Login in  */
  @ApiOperation({ summary: 'Login In user' })
  @Post('/login')
  async Login(
    @Body() data: UserCredentialsdto,
    @Res({ passthrough: true }) response: Response,
  ) {
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
      const accessToken = await this.jwt.CreateAccesstoken(userz.Email);
      response.cookie('x-access-token', accessToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure: false,
      });
      const refreshtokendata = await this.authservice.CreateRefreshToken(userz);
      const refreshtoken = await this.jwt.CreateRefreshToken(refreshtokendata);
      response.cookie('x-refresh-token', refreshtoken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: false,
      });
      return { accessToken, refreshtoken };
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    /**Refresh Access token */
  }

  @Post('/RefreshAccessToken')
  async IssueNewAccessToken(
    @Body() datas: refreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      // console.log(RefreshToken);
      const data = await this.jwt.decodeRefreshToken(datas.RefreshToken);
      console.log(data);
      if (!data) {
        throw new HttpException('Invalid RefreshToken', HttpStatus.NOT_FOUND);
      }
      const { Email } = await this.userservice.findUser(data.userId);
      console.log(Email);
      const accessToken = await this.jwt.CreateAccesstoken(Email);
      response.cookie('x-access-token', accessToken, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure: false,
      });
      return { accessToken };
    } catch (e) {
      return e;
    }
  }
  @Get('logout')
  @ApiOperation({
    description: 'Log the user out of the system',
  })
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) response: Response) {
    response.cookie('x-access-token', 'none');
    response.cookie('x-refresh-token', 'none');
    return {
      loggedOut: true,
    };
  }
}
