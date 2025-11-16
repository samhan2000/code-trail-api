// src/oauth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

const fs = require('fs');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {

        const publicKey = fs.readFileSync(process.env.PUBLIC_RSA_KEY, 'utf8')

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            algorithms: ['RS256'],
            secretOrKey: publicKey,
            audience: 'codetrail-client-id',
            issuer: `${process.env.PUBLIC_PROVIDER_URL}/oauth`,
        });
    }

    async validate(payload: any) {
        const { sub, tokenVersion } = payload;
        console.log(sub, "sub")

        if (!sub) {
            throw new UnauthorizedException('Invalid token: missing id');
        }


        // const user = await this.userService.findByEmail(email);
        // if (!user) throw new UnauthorizedException('User not found');

        // if (user.tokenVersion !== tokenVersion) {
        //     throw new UnauthorizedException('Token expired or revoked');
        // }

        return {
            id: sub
        };
    }
}
