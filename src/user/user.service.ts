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

  /**
   *  Create User
   */

  async createUser(data: UserCredentialsDto) {
    const { password } = data;

    const hashedpassword = await this.hashing.toHash(password);

    const generatedReferalCode = this.idgeneratorservice.generateReferal('US');
    const user = this.userModel.create({
      email: data.email,
      password: hashedpassword,
      deviceToken: data.deviceToken,
      referralCode: generatedReferalCode,
    });
    return user;
  }

  /**
   * find User with email
   */

  findUserwithEmail(email: string) {
    return this.userModel.findOne({ email }).select('+password');
  }

  /**
   * Apply Referral for User
   */

  async applyReferral(refCode: UserReferralDto, user) {
    //Checking if the user with the provided Referral code Exists
    const res = await this.userModel.findOne({
      referralCode: refCode.refferalCode,
    });
    console.log(res);
    if (!res) {
      throw new HttpException('Invalid Referral Code', HttpStatus.NOT_FOUND);
    }

    //Updating the users Referral  with the new users Id
    await this.userModel.findByIdAndUpdate(
      {
        _id: res._id,
      },
      { $push: { referrals: user._id } },
    );
    //Allowing the new user to be let into the app
    await this.userModel.findByIdAndUpdate(
      { _id: user._id },
      {
        $set: { isAllowed: true },
      },
    );
  }

  /**
   * find User
   */

  async findUser(user) {
    try {
      const res = await this.userModel.findById({ _id: user });
      return res;
    } catch (e) {
      throw new HttpException('No Such User', HttpStatus.BAD_REQUEST);
    }
  }
}
