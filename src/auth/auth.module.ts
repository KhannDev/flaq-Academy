import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schema/user.schema';
import { UserService } from '../user/user.service';
import { HashingService } from '../utils/hashing/hashing.service';
import { IdGeneratorService } from '../utils/id-generator/id-generator.service';
import { JwtsService } from '../utils/jwt/jwt.service';
import {
  RefreshToken,
  RefreshTokenSchema,
} from '../utils/jwt/schema/Refreshtoken';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Contributor, ContributorSchema } from './schema/auth.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: User.name, schema: UserSchema },
      { name: Contributor.name, schema: ContributorSchema },
    ]),
    HttpModule,
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
