import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { async } from 'rxjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import configration from './common/configration';
import { JwtsService } from './utils/jwt/jwt.service';
import { CampaignsModule } from './campaigns/campaigns.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV == 'development' ? '.dev.env' : '.prod.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        uri: configration().databaseURI,
      }),
    }),
    AuthModule,
    UserModule,
    CampaignsModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtsService],
})
export class AppModule {}
