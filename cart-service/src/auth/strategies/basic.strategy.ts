import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { AuthService } from '../auth.service';
import { Request } from 'express';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ passReqToCallback: true });
  }

  async validate(req: Request): Promise<any> {
    const authorizationToken = ((req.headers as unknown) as Record<string, string>).authorization;
    const encodedToken = authorizationToken.replace('Basic ', '');
    const [name, password] = Buffer.from(encodedToken, 'base64')
      .toString('utf-8')
      .split(':');

    const user = await this.authService.validateUser(name, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return { id: user.id };
  }
}
