import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { slugify } from 'src/common/services/slugify';
import { NewModuleDTO } from 'src/DTO/NewModuleDTO';
import { NewStackDTO } from 'src/DTO/NewStackDTO';
import { PrismaService } from 'src/prisma/prisma.service';
import { StacksService } from '../stacks/stacks.service';

@Injectable()
export class ModulesService {

    constructor(private prisma: PrismaService, private stackService: StacksService) { }

    async createNewModule(req: NewModuleDTO) {
        if (!req || !req.userId) {
            throw new BadRequestException("Invalid Request")
        }

        try {
            await this.prisma.module.create({
                data: {
                    name: req.name,
                    description: req.description,
                    slug: slugify(req.name),
                    userId: req.userId,
                    stackId: req.stackId
                }
            })
        } catch (err) {
            console.error(err, "Error")
            throw new BadRequestException(`Error while adding module: ${err}`)
        }
    }

    async getModuleByUserIdAndSlugId(userId: string, slug: string) {
        return this.prisma.module.findFirst({
            where: {
                userId,
                slug
            }
        })
    }

    async getModulesByStackId(req: any) {

        const stack = await this.stackService.getStackDetailsByUserIdAndSlug(req.userId, req.stackSlug)

        if (!stack) throw new NotFoundException("Stack not found")

        const modules = await this.prisma.module.findMany({
            where: { stackId: stack.id },
            include: {
                lessons: {
                    select: { completed: true },
                },
            },
            orderBy: { createdAt: "asc" },
        });

        const formatted = modules.map((m) => {
            const total = m.lessons.length;
            const completed = m.lessons.filter((l) => l.completed).length;

            return {
                id: m.id,
                slug: m.slug,
                name: m.name,
                description: m.description,
                completed,
                total
            };
        });

        return { modules: formatted, stackId: stack.id, stackName: stack.name }
    }
}
