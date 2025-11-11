import { Module } from '@nestjs/common';
import { StacksController } from './stacks/stacks.controller';
import { ModulesController } from './modules/modules.controller';
import { LessonsController } from './lessons/lessons.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StacksService } from './stacks/stacks.service';
import { ModulesService } from './modules/modules.service';
import { LessonsService } from './lessons/lessons.service';
import { CommonFeatureService } from './common-feature.service';
import { CommonFeatureController } from './common-feature.controller';
import { SearchController } from './search/search.controller';
import { SearchService } from './search/search.service';
import { OauthModule } from 'src/oauth/oauth.module';

@Module({
  imports: [PrismaModule, OauthModule],
  controllers: [StacksController, ModulesController, LessonsController, CommonFeatureController, SearchController],
  providers: [StacksService, ModulesService, LessonsService, CommonFeatureService, SearchService]
})
export class FeatureModule { }
