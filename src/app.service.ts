import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health() {
    const data = {
      uptime: process.uptime(),
      message: 'Ok',
      date: new Date(),
    };
    return data;
  }
}
