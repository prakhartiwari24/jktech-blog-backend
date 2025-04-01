import { Injectable, Logger } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findByGoogleOrFacebookId(
    googleId?: string,
    facebookId?: string,
  ): Promise<User | null> {
    this.logger.log(
      `UserService ~ findByGoogleOrFacebookId service invoked with googleId: ${googleId}, facebookId: ${facebookId}`,
    );
    return this.userModel
      .findOne({ $or: [{ googleId }, { facebookId }] })
      .exec();
  }

  async create(userData: Partial<User>): Promise<User> {
    this.logger.log(
      `UserService ~ create service invoked with userData: ${userData}`,
    );
    const user = new this.userModel(userData);
    this.logger.log(
      `UserService ~ create service new user created successfully`,
    );
    return user.save();
  }
}
