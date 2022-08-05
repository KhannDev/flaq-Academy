import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserCredentialsdto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userservice: UserService) {}
  @ApiOperation({ summary: 'create new user' })
  @Post()
  CreateUser(@Body() data: UserCredentialsdto) {
    return this.userservice.CreateUser(data);
  }

  /**Get user Profile */

  /**Apply  User Referral */
}
