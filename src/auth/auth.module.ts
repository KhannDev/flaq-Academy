import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { HashingService } from 'src/utils/hashing/hashing.service';
import { JwtsService } from 'src/utils/jwt/jwt.service';
import {
  RefreshToken,
  RefreshTokenSchema,
} from 'src/utils/jwt/schema/Refreshtoken';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, HashingService, JwtsService],
  exports: [AuthService],
})
export class AuthModule {}
