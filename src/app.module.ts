import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OauthModule } from './oauth/oauth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { FeatureModule } from './feature/feature.module';

@Module({
  imports: [
    OauthModule,
    PrismaModule,
    FeatureModule
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule { }
