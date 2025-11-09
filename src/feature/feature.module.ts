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

@Module({
  imports: [PrismaModule],
  controllers: [StacksController, ModulesController, LessonsController, CommonFeatureController],
  providers: [StacksService, ModulesService, LessonsService, CommonFeatureService]
})
export class FeatureModule { }
