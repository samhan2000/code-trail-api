import { Injectable } from '@nestjs/common';
import { StacksService } from './stacks/stacks.service';
import { LessonsService } from './lessons/lessons.service';

@Injectable()
export class CommonFeatureService {

    constructor(
        private stackService: StacksService,
        private lessonService: LessonsService
    ) { }

    async getDashboardContent(userId) {
        const stackSummary = await this.stackService.getUserStacksSummary(userId)

        const recentlyVisited = await this.lessonService.getRecentlyVisitedLesson(userId)

        return { stackSummary, recentlyVisited }
    }
}
