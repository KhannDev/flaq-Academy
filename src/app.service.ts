import { Inject, Injectable } from '@nestjs/common';
import { JwtsService } from './utils/jwt/jwt.service';

@Injectable()
export class AppService {
  constructor(private readonly jwtservice: JwtsService) {}
  async getHello() {
    return 'Hello';
  }
}
