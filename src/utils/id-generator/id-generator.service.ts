import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

@Injectable()
export class IdGeneratorService {
  private cumtomNano6: () => string;
  private cumtomNano4: () => string;
  private cumtomNano3: () => string;

  constructor() {
    // this.cumtomNano6 = customAlphabet(
    //   'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    //   6,
    // );
    this.cumtomNano4 = customAlphabet(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
      4,
    );
    this.cumtomNano3 = customAlphabet(
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
      3,
    );
  }

  generateReferal(prefix: string): string {
    return prefix + '-' + this.cumtomNano4() + '-' + this.cumtomNano4();
  }
}
