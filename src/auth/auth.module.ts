import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { HashingService } from '../utils/hashing/hashing.service';
import { IdGeneratorService } from '../utils/Id-generator/Id-generator.service';
import { JwtsService } from '../utils/jwt/jwt.service';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '../utils/jwt/schema/Refreshtoken';
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
  providers: [
    AuthService,
    UserService,
    HashingService,
    JwtsService,
    IdGeneratorService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
