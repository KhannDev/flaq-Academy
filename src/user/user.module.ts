import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { HashingService } from 'src/utils/hashing/hashing.service';
import { IdGeneratorService } from 'src/utils/Id-generator/Id-generator.service';
import { User, UserSchema } from './schema/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, HashingService, IdGeneratorService],
  // exports: [UserService],
})
export class UserModule {}
