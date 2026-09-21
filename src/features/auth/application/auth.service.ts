import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AUTH_REPOSITORY } from '../domain/auth.repository.js';
import type { AuthRepository } from '../domain/auth.repository.js';
import { LoginDto } from '../presentation/http/dto/login.dto.js';
import { LoginResource } from '../presentation/http/resources/login.resource.js';
import { RefreshResource } from '../presentation/http/resources/RefreshResource.js';
import { env } from 'process';


@Injectable()

export class AuthService {
    constructor(@Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository, private readonly jwtService: JwtService) {}

    async login(dto: LoginDto) {
      const user = await this.authRepository.findUserForLogin(dto.identifier);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('User account is inactive');
        }

        const passwordMatched = await bcrypt.compare(dto.password, user.password);

        if (!passwordMatched) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const roles =
            user.roles.map(
                (role) => role.slug,
            );

        const permissions = [
            ...new Set(
                user.roles.flatMap(
                    (role) =>
                        role.permissions.map(
                            (permission) =>
                                permission.slug,
                        ),
                ),
            ),
        ];

        const payload = {
            sub: user.id,
            username: user.username,
            phone: user.phone,
            roles,
            permissions,
        };

        const accessToken =
            await this.jwtService.signAsync(
                payload,
                {
                    expiresIn: (env.JWT_ACCESS_TOKEN_EXPIRES_IN ?? '15m') as any,
                },
            );

        const refreshToken =
            await this.jwtService.signAsync(
                {
                    sub: user.id,
                    type: 'refresh',
                },
                {
                    expiresIn: (env.JWT_REFRESH_TOKEN_EXPIRES_IN ?? '15m') as any,
                },
            );

        return new LoginResource(accessToken, refreshToken, user, roles, permissions);
    }

    async refresh(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken);

            if (payload.type !== 'refresh') {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const user = await this.authRepository.findUserById(payload.sub);

            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            if (!user.isActive) {
                throw new UnauthorizedException('User account is inactive');
            }

            const roles =
                user.roles.map(
                    (role) => role.slug,
                );

            const permissions = [
                ...new Set(
                    user.roles.flatMap(
                        (role) =>
                            role.permissions.map(
                                (permission) =>
                                    permission.slug,
                            ),
                    ),
                ),
            ];

            const accessToken =
                await this.jwtService.signAsync(
                    {
                        sub: user.id,
                        username: user.username,
                        phone: user.phone,
                        roles,
                        permissions,
                    },
                    {
                        expiresIn: (env.JWT_ACCESS_TOKEN_EXPIRES_IN ?? '15m') as any,
                    },
                );

            const newRefreshToken =
                await this.jwtService.signAsync(
                    {
                        sub: user.id,
                        type: 'refresh',
                    },
                    {
                        expiresIn: (env.JWT_REFRESH_TOKEN_EXPIRES_IN ?? '15m') as any,
                    },
                );

            return new RefreshResource(accessToken, newRefreshToken);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }

            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}