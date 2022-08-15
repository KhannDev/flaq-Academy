import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { UserAuthGuard } from 'src/common/usegaurds/user-auth.guard';
import { UserCredentialsdto, UserReferralDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userservice: UserService) {}

  @ApiOperation({ summary: 'create new user' })
  @Post()
  createUser(@Body() data: UserCredentialsdto) {
    return this.userservice.CreateUser(data);
  }

  /**Get user Profile */

  /**Apply  User Referral */
  @UseGuards(UserAuthGuard)
  @Post('/UserReferral')
  async userReferral(@Body() code: UserReferralDto, @ReqUser() user) {
    return await this.userservice.ApplyReferal(code, user);
  }
  @UseGuards(UserAuthGuard)
  @Post('Userdetails')
  async userDetail(@ReqUser() user) {
    return this.userservice.findUser(user._id);
  }
}
