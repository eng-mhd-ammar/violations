import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  PassportStrategy,
} from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { AuthenticatedUser } from '../../../../../core/authorization/authenticated-user.type';

interface JwtPayload {
  sub: number;
  username: string;
  phone: string;
  roles: string[];
  permissions: string[];
}

@Injectable()
export class JwtStrategy
  extends PassportStrategy(Strategy)
{
  constructor() {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey:
        process.env.JWT_SECRET!,
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<AuthenticatedUser> {
    if (!payload.sub) {
      throw new UnauthorizedException(
        'Invalid token',
      );
    }

    return {
      id: payload.sub,
      username: payload.username,
      phone: payload.phone,

      roles: payload.roles ?? [],

      permissions:
        payload.permissions ?? [],
    };
  }
}