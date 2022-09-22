import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReqUser } from '../common/decorators/req-user.decorator';
import { UserAuthGuard } from '../common/usegaurds/user-auth.guard';
import { UserCredentialsDto, UserReferralDto } from './dto/user.dto';
import { User } from './schema/user.schema';
import { UserService } from './user.service';
@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userservice: UserService) {}

  /**
   * Create User
   */

  @ApiOperation({ summary: 'create new user' })
  @ApiResponse({
    status: 201,
    description: 'User Created Successfully',
  })
  @Post()
  createUser(@Body() data: UserCredentialsDto) {
    return this.userservice.createUser(data);
  }

  /**
   * Apply  User Referral
   */

  @ApiOperation({ summary: 'adding Referral Code' })
  @ApiResponse({
    status: 201,
    description: 'Referral Code added Successfully',
  })
  @UseGuards(UserAuthGuard)
  @Post('/referral')
  async userReferral(@Body() code: UserReferralDto, @ReqUser() user: User) {
    return await this.userservice.applyReferral(code, user);
  }

  /**
   * Fetching USer Meta Data
   */

  @ApiOperation({ summary: 'fetching User Meta data' })
  @ApiResponse({
    status: 201,
    description: 'User Meta data fetched Successfully',
  })
  @UseGuards(UserAuthGuard)
  @Post('details')
  async userDetail(@ReqUser() user) {
    return this.userservice.findUser(user._id);
  }
}
