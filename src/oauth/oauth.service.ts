// src/oauth/oauth.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';


const fs = require('fs');

@Injectable()
export class OauthService {

    constructor(private prisma: PrismaService) { }

    private privateKey = fs.readFileSync(process.env.PRIVATE_RSA_KEY)

    async generateTokens(username) {

        console.log(username, "Email")

        const now = Math.floor(Date.now() / 1000);

        const userDetails = await this.prisma.user.findFirst({
            where: {
                username
            }
        })

        if (!userDetails) return
        // try {
        //     userDetails = { "sub": "sam@yopmail.com", name: "sam", email: "sam@yopmail.com", "tokenVersion": "1078d735-a418-46b9-80da-f8616a7514d5" }
        // } catch (err) {
        //     userDetails = {}
        // }

        const tokenVersion = userDetails.tokenVersion ?? crypto.randomUUID()

        const accessPayload = {
            sub: userDetails.id,
            id: userDetails.id,
            username: userDetails.username,
            email: userDetails.email,
            iss: "/oauth",
            aud: "codetrail-client-id",
            iat: now,
            scope: "openid profile email",
            tokenVersion
        };

        console.log(userDetails, "USER DETAILS")
        const payload = {
            sub: userDetails.id,
            aud: "codetrail-client-id",
            iss: "/oauth",
            iat: now,
            // exp: now + 3600,
            username: userDetails.username,
            name: userDetails.name,
            email: userDetails.email,
        };

        const idToken = jwt.sign(payload, this.privateKey, {
            algorithm: "RS256",
            expiresIn: "1h",
            keyid: "codetrail-client-id"
        });



        const accessToken = jwt.sign(
            accessPayload,
            this.privateKey,
            {
                algorithm: "RS256",
                expiresIn: "1h",
                keyid: "codetrail-client-id",

            }
        );

        await this.prisma.user.update({
            where: {
                email: userDetails.email
            },
            data: {
                tokenVersion
            }
        })

        return {
            access_token: accessToken,
            id_token: idToken,
            token_type: 'Bearer',
            expires_in: 900
        };
    }


    validateAuthCode(code: string) {
        return code === 'mock_auth_code';
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async validateLogin(username, password) {
        const user = await this.prisma.authUser.findFirst({
            where: {
                username
            }
        })

        if (!user) {
            throw new NotFoundException("User not found")
        }

        const valid = bcrypt.compare(password, user.password)

        if (!valid) {
            throw new BadRequestException("Invalid Credentials")
        }

        return user
    }


    async register(req: any) {
        const hashedPassword = await this.hashPassword(req.password)

        try {
            await Promise.all([
                this.prisma.authUser.create({
                    data: {
                        name: req.name,
                        username: req.username,
                        email: req.email,
                        password: hashedPassword,
                        isActive: true,
                    },
                }),
                this.prisma.user.create({
                    data: {
                        name: req.name,
                        username: req.username,
                        email: req.email,
                    },
                }),
            ]);

            return { success: true }
        } catch (err) {
            if (err.code === 'P2002') {
                const field = err.meta?.target?.[0];

                let message = 'Duplicate entry';
                if (field === 'email') message = 'Email already exists';
                else if (field === 'username') message = 'Username already taken';

                throw new BadRequestException({ message, field });
            }

            console.error(err);
            throw new InternalServerErrorException('Something went wrong');
        }
    }
}
