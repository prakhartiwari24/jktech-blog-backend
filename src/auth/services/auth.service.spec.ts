import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../users/user.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      findByGoogleOrFacebookId: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('validateUser', () => {
    it('should return an existing user', async () => {
      const existingUser = { id: 'u1', email: 'test@example.com' };
      userService.findByGoogleOrFacebookId!.mockResolvedValue(existingUser);

      const result = await authService.validateUser({
        googleId: 'g123',
        email: 'test@example.com',
      });

      expect(userService.findByGoogleOrFacebookId).toHaveBeenCalled();
      expect(result).toEqual(existingUser);
    });

    it('should create a user if not found', async () => {
      userService.findByGoogleOrFacebookId!.mockResolvedValue(null);
      const newUser = { id: 'u2', email: 'new@example.com' };
      userService.create!.mockResolvedValue(newUser);

      const result = await authService.validateUser({
        facebookId: 'fb123',
        email: 'new@example.com',
      });

      expect(userService.create).toHaveBeenCalledWith({
        googleId: undefined,
        facebookId: 'fb123',
        email: 'new@example.com',
      });
      expect(result).toEqual(newUser);
    });
  });

  describe('login', () => {
    it('should return signed jwt token', async () => {
      const user = { id: 'u1', email: 'test@example.com', role: 'user' };
      jwtService.sign!.mockReturnValue('mock.jwt.token');

      const result = await authService.login(user);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
        role: user.role,
      });

      expect(result).toEqual({ access_token: 'mock.jwt.token' });
    });
  });
});
