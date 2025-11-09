import { Body, Controller, Post } from '@nestjs/common';
import { GauthService } from './gauth.service';
import { OauthService } from '../oauth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('gauth')
export class GauthController {

    constructor(private googleAuthService: GauthService, private authService: OauthService, private prisma: PrismaService) { }

    @Post("google-login")
    async googleLogin(@Body("id_token") idToken: string) {
        const ticket = await this.googleAuthService.verifyGoogleToken(idToken);
        const payload = ticket.getPayload();

        const user = await this.prisma.user.findFirst({
            where: {
                email: payload.email
            }
        })

        // if (!user) {
        //     await this.prisma.user.create({
        //         data: {
        //             name: payload.name,
        //             email: payload.email
        //         }
        //     })
        // }

        const token = this.authService.generateTokens(payload.email);
        return { access_token: token };
    }
}
