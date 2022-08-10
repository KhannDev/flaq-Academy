import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { JwtsService } from 'src/utils/jwt/jwt.service';
import {
  RefreshToken,
  RefreshTokenSchema,
} from 'src/utils/jwt/schema/Refreshtoken';
import { CampaignsController } from './campaigns.controller';
import { CampaignsService } from './campaigns.service';
import { Campaign, CampaignSchema } from './schema/campaigns.schema';
import {
  ParticipateCampaign,
  ParticipateCampaignSchema,
} from './schema/participate.schema';
import { Quiz, QuizSchema } from './schema/quiz.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: ParticipateCampaign.name, schema: ParticipateCampaignSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
    ]),
    UserModule,
  ],
  controllers: [CampaignsController],
  providers: [CampaignsService, JwtsService, AuthService],
})
export class CampaignsModule {}
