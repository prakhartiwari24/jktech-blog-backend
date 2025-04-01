import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get('FACEBOOK_CLIENT_SECRET'),
      callbackURL: 'http://localhost:5002/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { id, emails, name } = profile;
    const user = {
      facebookId: id,
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };
    return user;
  }
}
