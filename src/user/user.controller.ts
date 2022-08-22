import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ReqUser } from 'src/common/decorators/req-user.decorator';
import { UserAuthGuard } from 'src/common/usegaurds/user-auth.guard';
import { UserCredentialsDto, UserReferralDto } from './dto/user.dto';
import { User } from './schema/user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userservice: UserService) {}

  @ApiOperation({ summary: 'create new user' })
  @Post()
  createUser(@Body() data: UserCredentialsDto) {
    return this.userservice.createUser(data);
  }

  /**Get user Profile */

  /**Apply  User Referral */
  @ApiOperation({ summary: 'Adding Referral Code' })
  @UseGuards(UserAuthGuard)
  @Post('/referral')
  async userReferral(@Body() code: UserReferralDto, @ReqUser() user: User) {
    return await this.userservice.applyReferral(code, user);
  }
  @ApiOperation({ summary: 'fetching User Meta data' })
  @UseGuards(UserAuthGuard)
  @Post('details')
  async userDetail(@ReqUser() user) {
    return this.userservice.findUser(user._id);
  }
}
