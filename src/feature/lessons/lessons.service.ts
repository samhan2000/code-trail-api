import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { slugify } from 'src/common/services/slugify';
import { NewLessonDTO } from 'src/DTO/NewLessonDTO';
import { PrismaService } from 'src/prisma/prisma.service';
import { formatDistanceToNow } from "date-fns";
import { ModulesService } from '../modules/modules.service';

@Injectable()
export class LessonsService {

    constructor(private prisma: PrismaService, private moduleService: ModulesService) { }

    async createNewLesson(req: NewLessonDTO) {
        try {
            const moduleData = await this.moduleService.getModuleByUserIdAndSlugId(req.userId, req.moduleSlug)
            await this.prisma.lesson.create({
                data: {
                    title: req.title,
                    description: req.description,
                    slug: slugify(req.title),
                    notes: req.notes,
                    code: req.code,
                    userId: req.userId,
                    moduleId: moduleData.id
                }
            })
        } catch (err) {
            throw new BadRequestException(`Error while adding lesson: ${err}`)
        }
    }

    async getRecentlyVisitedLesson(userId) {
        const recentLessons = await this.prisma.lesson.findMany({
            where: {
                userId,
                lastVisited: { not: null },
            },
            orderBy: {
                lastVisited: 'desc',
            },
            take: 3,
            select: {
                id: true,
                title: true,
                slug: true,
                description: true,
                lastVisited: true,
            },
        });

        if (recentLessons.length > 0) {
            return recentLessons.map((lesson) => ({
                ...lesson,
                lastVisitedAgo: lesson.lastVisited
                    ? formatDistanceToNow(new Date(lesson.lastVisited), { addSuffix: true })
                    : "Never visited",
            }));
        } else return []
    }

    async getAllLessonsForModule(req) {

        const moduleData = await this.moduleService.getModuleByUserIdAndSlugId(req.userId, req.moduleSlug)

        if (!moduleData) throw new NotFoundException("Module not found")

        const allLessons = await this.prisma.lesson.findMany({
            where: {
                moduleId: moduleData.id,
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        return { allLessons, moduleName: moduleData.name, moduleId: moduleData.id }
    }

    async getLessonBySlug(req: any) {
        return await this.prisma.lesson.findFirst({
            where: {
                slug: req.lessonSlug,
                userId: req.userId
            }
        })
    }

    async saveLesson(req: any) {
        await this.prisma.lesson.update({
            where: {
                id: req.lessonId
            },
            data: {
                title: req?.data?.title,
                description: req?.data?.description,
                slug: slugify(req?.data.title),
                notes: req?.data?.notes,
                code: req?.data?.code,
            }
        })
    }

    async markStatus(req: any) {
        return await this.prisma.lesson.update({
            where: {
                id: req.lessonId
            },
            data: {
                completed: req.completed
            }
        })
    }
}
