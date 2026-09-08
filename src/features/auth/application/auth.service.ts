import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginResource } from '../presentation/http/resources/login.resource.js';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import {
  AUTH_REPOSITORY,
} from '../domain/auth.repository.js';

import type {
  AuthRepository,
} from '../domain/auth.repository.js';
import { LoginDto } from '../presentation/http/dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(@Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository, private readonly jwtService: JwtService) {}

  async login(dto: LoginDto) {
    const user = await this.authRepository.findUserForLogin(dto.identifier);

    if (!user) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'User account is inactive',
      );
    }

    const passwordMatched = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatched) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const roles = user.roles.map(
      (role) => role.slug,
    );

    const payload = {
      sub: user.id,
      username: user.username,
      phone: user.phone,
      roles,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    
    return new LoginResource(accessToken, user);
  }
}