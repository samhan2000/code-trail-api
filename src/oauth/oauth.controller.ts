// src/oauth/oauth.controller.ts
import { Controller, Get, Post, Req, Res, Body, Query } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { Request, Response } from 'express';
import * as url from 'url';
import * as jwt from 'jsonwebtoken';
import * as rsaPemToJwk from 'pem-jwk';

const fs = require('fs');
const base64url = require("base64url");

@Controller('oauth')
export class OauthController {
    constructor(private readonly oauthService: OauthService) { }

    @Get('authorize')
    authorize(@Query() query: any, @Res() res: Response) {
        const { client_id, redirect_uri, state, code_challenge } = query;

        console.log(redirect_uri, "Redirect URI")

        res.redirect(`${process.env.FRONTENDURL}/auth/login?redirect_uri=${redirect_uri}&state=${state}&client_id=${client_id}`);

    }

    @Post('login')
    async login(@Body() body: any, @Res() res: Response) {
        console.log(body, "BODY")
        const { redirect_uri, state, username, password } = body;
        const code = username;

        try {
            const valid = await this.oauthService.validateLogin(username, password)
            if (!valid) return res.status(401).json({ error: "Invalid credentials" });
        } catch (err) {
            console.log("In Login", err)
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const redirectUrl = new url.URL(redirect_uri);
        redirectUrl.searchParams.append('code', code);
        if (state) redirectUrl.searchParams.append('state', state);

        res.redirect(redirectUrl.toString());
    }

    @Post('token')
    async token(@Body() body: any, @Res() res: Response) {
        console.log(body, "BODY IN TOKEN")
        const { code } = body;

        const tokens = await this.oauthService.generateTokens(code)
        console.log(tokens, "TOKENS")

        res.status(200).json(tokens);
    }

    @Get('userinfo')
    async userinfo(@Req() req: any, @Res() res: Response) {
        const authHeader = req.headers['authorization'] || '';
        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const publicKey = fs.readFileSync(process.env.PUBLIC_RSA_KEY)
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        console.log("Decoded token:", decoded);

        const email = decoded.sub;
        let userDetails
        console.log(email, "EMAIL")
        try {
            // userDetails = { name: "Sam", email: "sam@yopmail.com" }
            // userDetails = await this.pr
        } catch (err) {
            userDetails = {}
        }
        console.log(userDetails, "In Get User Info")
        const sampleRepsonse = {
            sub: '123',
            id: userDetails.id,
            name: userDetails.name,
            email: userDetails.email,
            aud: 'codetrail-client-id'
        }
        console.log("Sample Response", sampleRepsonse)
        res.json(sampleRepsonse);
    }

    @Get('.well-known/openid-configuration')
    openid(@Req() req: Request, @Res() res: Response) {
        console.log(req.body, "Request in OAuth")
        res.json({
            "issuer": "/oauth",
            "authorization_endpoint": `${process.env.INTERNAL_PROVIDER_URL}/oauth/authorize`,
            "token_endpoint": `${process.env.INTERNAL_PROVIDER_URL}/oauth/token`,
            "userinfo_endpoint": `${process.env.INTERNAL_PROVIDER_URL}/oauth/userinfo`,
            "jwks_uri": `${process.env.INTERNAL_PROVIDER_URL}/oauth/.well-known/jwks.json`,
            "response_types_supported": ["code", "id_token", "token id_token"],
            "subject_types_supported": ["public"],
            "id_token_signing_alg_values_supported": ["RS256"]
        });
    }

    @Get('.well-known/jwks.json')
    async jwks(@Res() res: Response) {
        try {
            const publicKeyPem = fs.readFileSync(process.env.PUBLIC_RSA_KEY, 'utf8');
            const jwk = rsaPemToJwk.pem2jwk(publicKeyPem);
            jwk.use = 'sig';
            jwk.alg = 'RS256';
            jwk.kid = 'codetrail-client-id';
            res.json({ keys: [jwk] });
        } catch (err) {
            console.error('Failed to generate JWKS:', err);
            res.status(500).json({ error: 'Failed to load JWKS' });
        }
    }

    @Post("register")
    register(@Body() req: any) {
        return this.oauthService.register(req)
    }
}
