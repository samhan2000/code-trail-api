import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GauthService } from './gauth/gauth.service';
import { GauthController } from './gauth/gauth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [OauthController, GauthController],
  providers: [OauthService, GauthService, JwtAuthGuard, JwtStrategy],
  imports: [PrismaModule, PassportModule.register({ defaultStrategy: 'jwt' }),],
  exports: [JwtAuthGuard, JwtStrategy, PassportModule]
})
export class OauthModule { }
