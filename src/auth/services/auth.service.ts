import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../../users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(profile: any): Promise<any> {
    const { googleId, facebookId, email } = profile;
    let user = await this.userService.findByGoogleOrFacebookId(
      googleId,
      facebookId,
    );
    if (!user) {
      user = await this.userService.create({
        googleId,
        facebookId,
        email,
      });
    }
    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
