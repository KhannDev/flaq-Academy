import { Inject, Injectable } from '@nestjs/common';
import { JwtsService } from './utils/jwt/jwt.service';

@Injectable()
export class AppService {
  constructor(private readonly jwtservice: JwtsService) {}
  async getHello() {
    const Id = '62ebbe803152947ce40b0092';

    // const token = await this.jwtservice.generateAccessToken(Id);
    // console.log('token', token);
    // const tokenref = await this.jwtservice.generateRefreshToken(Id);
    // console.log('tokenref', tokenref);

    // const id = await this.jwtservice.CreateRefreshToken();
    // console.log(id);
  }
}
