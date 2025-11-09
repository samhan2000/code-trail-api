// src/oauth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as fs from 'fs';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            algorithms: ['RS256'],
            secretOrKey: fs.readFileSync(process.env.PUBLIC_RSA_KEY),
            audience: 'codetrail-client-id',
            issuer: `${process.env.INTERNAL_PROVIDER_URL}/oauth`,
        });
    }

    async validate(payload: any) {
        // payload = decoded JWT body
        const { email, tokenVersion } = payload;

        if (!email) {
            throw new UnauthorizedException('Invalid token: missing email');
        }

        const user = await this.userService.findByEmail(email);
        if (!user) throw new UnauthorizedException('User not found');

        if (user.tokenVersion !== tokenVersion) {
            throw new UnauthorizedException('Token expired or revoked');
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            tokenVersion: user.tokenVersion,
        };
    }
}
