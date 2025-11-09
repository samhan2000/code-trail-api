import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { NewLessonDTO } from 'src/DTO/NewLessonDTO';

@Controller('lessons')
export class LessonsController {

    constructor(private lessonService: LessonsService) { }

    @Post("create")
    async create(@Body() req: NewLessonDTO) {
        await this.lessonService.createNewLesson(req)
    }

    @Post("getAllLessonsForModule")
    getAllLessonsForModule(@Body() req: any) {
        return this.lessonService.getAllLessonsForModule(req)
    }

    @Post("getLessonBySlug")
    getLessonBySlug(@Body() req: any) {
        return this.lessonService.getLessonBySlug(req)
    }

    @Post("saveLesson")
    saveLesson(@Body() req: any) {
        return this.lessonService.saveLesson(req)
    }

    @Post("markStatus")
    markStatus(@Body() req: any) {
        return this.lessonService.markStatus(req)
    }
}
