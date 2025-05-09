import {
  Controller,
  Get,
  Req,
  UseGuards,
  Res,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = await this.authService.validateUser(req.user);
    const token = await this.authService.login(user);
    return res.redirect(`http://localhost:4200/?token=${token.access_token}`);
  }

  @Post('facebook/callback')
  async facebookAuthToken(@Body('token') accessToken: string) {
    const appSecret = this.configService.get('FACEBOOK_CLIENT_SECRET');
    const appId = this.configService.get('FACEBOOK_CLIENT_ID');

    const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appId}|${appSecret}`;

    try {
      const debugRes = await axios.get(debugTokenUrl);
      const isValid = debugRes.data.data?.is_valid;
      if (!isValid) {
        throw new Error('Invalid Facebook token');
      }

      const profileRes = await axios.get(
        `https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`,
      );

      const profile = profileRes.data;
      const user = await this.authService.validateUser({
        facebookId: profile.id,
        email: profile.email,
      });

      return this.authService.login(user);
    } catch (error) {
      console.error('Facebook login error:', error.message);
      throw error;
    }
  }

  @Post('facebook')
  async facebookOAuth(@Body('code') code: string) {
    const appId = this.configService.get('FACEBOOK_CLIENT_ID');
    const appSecret = this.configService.get('FACEBOOK_CLIENT_SECRET');
    const redirectUri = 'http://localhost:4200/auth/callback';

    try {
      const tokenRes = await axios.get(
        'https://graph.facebook.com/v19.0/oauth/access_token',
        {
          params: {
            client_id: appId,
            client_secret: appSecret,
            redirect_uri: redirectUri,
            code,
          },
        },
      );

      const { access_token } = tokenRes.data;
      const profileRes = await axios.get(
        'https://graph.facebook.com/me?fields=id,name,email',
        { params: { access_token } },
      );

      const profile = profileRes.data;
      const user = await this.authService.validateUser({
        facebookId: profile.id,
        email: profile.email,
      });

      return this.authService.login(user);
    } catch (err) {
      console.error('Facebook OAuth code exchange failed:', err.message);
      throw new UnauthorizedException('Facebook login failed');
    }
  }
}
