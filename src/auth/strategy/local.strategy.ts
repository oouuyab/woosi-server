import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'pw' });
  }

  async validate(email: string, pw: string): Promise<any> {
    return await this.authService.validateUserByEmailAndPw(email, pw);
  }
}
