import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { GauthService } from './gauth/gauth.service';
import { GauthController } from './gauth/gauth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Module({
  controllers: [OauthController, GauthController],
  providers: [OauthService, GauthService, JwtAuthGuard],
  imports: [PrismaModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  exports: [JwtAuthGuard]
})
export class OauthModule { }
