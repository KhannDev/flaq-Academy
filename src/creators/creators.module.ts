import { Module } from '@nestjs/common';
import { CreatorsService } from './creators.service';
import { CreatorsController } from './creators.controller';
import { Creators, CreatorsSchema } from 'src/auth/schema/auth.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import {
  RefreshToken,
  RefreshTokenSchema,
} from 'src/utils/jwt/schema/Refreshtoken';
import { UserService } from 'src/user/user.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { HashingService } from 'src/utils/hashing/hashing.service';
import { IdGeneratorService } from 'src/utils/id-generator/id-generator.service';
import {
  Campaign,
  CampaignSchema,
} from 'src/campaigns/schema/campaigns.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Creators.name, schema: CreatorsSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: User.name, schema: UserSchema },
      { name: Campaign.name, schema: CampaignSchema },
    ]),
    HttpModule,
  ],

  providers: [
    CreatorsService,
    AuthService,
    UserService,

    HashingService,
    IdGeneratorService,
  ],
  controllers: [CreatorsController],
  exports: [CreatorsService],
})
export class CreatorsModule {}
