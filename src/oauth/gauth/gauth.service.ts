import { Injectable } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GauthService {
    private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    async verifyGoogleToken(idToken: string) {
        return this.client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
    }
}
