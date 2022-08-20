import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashingService } from '../utils/hashing/hashing.service';
import { IdGeneratorService } from '../utils/id-generator/id-generator.service';
import { UserCredentialsDto, UserReferralDto } from './dto/user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly hashing: HashingService,
    private readonly idgeneratorservice: IdGeneratorService,
  ) {}
  /** Create User */
  async createUser(data: UserCredentialsDto) {
    const { password } = data;

    const hashedpassword = await this.hashing.toHash(password);
    console.log(hashedpassword);
    const ReferalCodez = this.idgeneratorservice.generateReferal('US');
    const user = this.userModel.create({
      Email: data.email,
      Password: hashedpassword,
      DeviceToken: data.deviceToken,
      ReferralCode: ReferalCodez,
    });
    return user;
  }
  // async UpdateDeviceToken() {}
  findUserwithEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password');
  }
  async applyReferal(refCode: UserReferralDto, user) {
    //Checking if the user with the provided Referral code Exists
    const res = await this.userModel.findOne({
      referralCode: refCode.refferalCode,
    });
    if (!res) {
      throw new HttpException('Invalid Referal Code', HttpStatus.NOT_FOUND);
    }

    //Updating the users Referral  with the new users Id
    await this.userModel.findByIdAndUpdate(
      {
        _id: res[0]._id,
      },
      { $push: { Referrals: user._id } },
    );
    //Allowing the new user to be let into the app
    await this.userModel.findByIdAndUpdate(
      { _id: user._id },
      {
        $set: { IsAllowed: true },
      },
    );
  }
  async findUser(user) {
    const res = await this.userModel.findById({ _id: user });
    return res;
  }
}
