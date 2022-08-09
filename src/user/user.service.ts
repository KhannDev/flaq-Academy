import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashingService } from 'src/utils/hashing/hashing.service';
import { IdGeneratorService } from 'src/utils/Id-generator/Id-generator.service';
import { UserCredentialsdto } from './dto/user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly hashing: HashingService,
    private readonly Idgeneratorservice: IdGeneratorService,
  ) {}
  /** Create User */
  async CreateUser(data: UserCredentialsdto) {
    const { Password } = data;
    console.log(Password);
    const hashedpassword = await this.hashing.toHash(Password);
    console.log(hashedpassword);
    const ReferalCodez = this.Idgeneratorservice.generateReferal('US');
    const user = this.userModel.create({
      Email: data.Email,
      Password: hashedpassword,
      DeviceToken: data.DeviceToken,
      ReferralCode: ReferalCodez,
    });
    return user;
  }
  async UpdateDeviceToken() {}
  findUserwithEmail(email: string) {
    return this.userModel.findOne({ Email: email }).select('+password');
  }
  async VerifyPassword(Password) {}
}
