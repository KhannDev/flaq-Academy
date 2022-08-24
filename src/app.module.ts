import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { async } from 'rxjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

import { JwtsService } from './utils/jwt/jwt.service';
import { CampaignsModule } from './campaigns/campaigns.module';
import { NewsModule } from './news/news.module';
import { UtilsService } from './utils/utils.service';
import { UtilsController } from './utils/utils.controller';
import { UtilsModule } from './utils/utils.module';
import { AwsS3Service } from './utils/aws/aws.service';
import configuration from './common/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV == 'development' ? '.dev.env' : '.prod.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        uri: configuration().databaseURI,
      }),
    }),
    AuthModule,
    UserModule,
    CampaignsModule,
    NewsModule,
    UtilsModule,
  ],
  controllers: [AppController, UtilsController],
  providers: [AppService, JwtsService, UtilsService, AwsS3Service],
})
export class AppModule {}
