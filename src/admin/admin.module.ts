import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { Creators, CreatorsSchema } from 'src/auth/schema/auth.schema';
import {
  Campaign,
  CampaignSchema,
} from 'src/campaigns/schema/campaigns.schema';
import {
  CategoriesLv1,
  CategoriesLv1Schema,
} from 'src/campaigns/schema/categories_level1.schema';
import {
  CategoriesLv2,
  CategoriesLv2Schema,
} from 'src/campaigns/schema/categories_level2.schema';
import {
  ParticipateCampaign,
  ParticipateCampaignSchema,
} from 'src/campaigns/schema/participate.schema';
import { Quiz, QuizSchema } from 'src/campaigns/schema/quiz.schema';
import {
  QuizEntries,
  QuizEntriesSchema,
} from 'src/campaigns/schema/quiz_entries.schema';
import { CreatorsModule } from 'src/creators/creators.module';
import { CreatorsService } from 'src/creators/creators.service';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { UserModule } from 'src/user/user.module';
import { JwtsService } from 'src/utils/jwt/jwt.service';
import {
  RefreshToken,
  RefreshTokenSchema,
} from 'src/utils/jwt/schema/Refreshtoken';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: ParticipateCampaign.name, schema: ParticipateCampaignSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: QuizEntries.name, schema: QuizEntriesSchema },
      { name: Creators.name, schema: CreatorsSchema },
      { name: User.name, schema: UserSchema },
      { name: CategoriesLv1.name, schema: CategoriesLv1Schema },
      { name: CategoriesLv2.name, schema: CategoriesLv2Schema },
    ]),
    CreatorsModule,
    UserModule,
    HttpModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AuthService, JwtsService],
})
export class AdminModule {}
