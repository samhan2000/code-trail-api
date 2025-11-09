import { BadRequestException, Injectable } from '@nestjs/common';
import { slugify } from 'src/common/services/slugify';
import { NewStackDTO } from 'src/DTO/NewStackDTO';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StacksService {

    constructor(private prisma: PrismaService) { }

    async createNewStack(req: NewStackDTO) {
        if (!req || !req.userId) {
            throw new BadRequestException("Invalid Request")
        }

        try {
            await this.prisma.stack.create({
                data: {
                    name: req.name,
                    slug: slugify(req.name),
                    description: req.description,
                    userId: req.userId
                }
            })
        } catch (err) {
            throw new BadRequestException(`Error while adding stack: ${err}`)
        }
    }

    async getStackDetailsByUserIdAndSlug(userId, slug) {
        return await this.prisma.stack.findFirst({
            where: {
                slug: slug,
                userId: userId
            }
        })
    }

    async getAllStacks(userId: string) {
        return this.prisma.stack.findMany({
            where: {
                userId
            }
        })
    }

    async getUserStacksSummary(userId: string) {
        const stacks = await this.prisma.stack.findMany({
            where: { userId },
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
                modules: {
                    select: {
                        id: true,
                        _count: { select: { lessons: true } }
                    }
                }
            }
        });

        const formatted = stacks.map(stack => {
            const totalModules = stack.modules.length;
            const totalLessons = stack.modules.reduce(
                (sum, mod) => sum + (mod._count.lessons || 0),
                0
            );

            return {
                id: stack.id,
                name: stack.name,
                slug: stack.slug,
                description: stack.description,
                totalModules,
                totalLessons
            };
        });

        return formatted;
    }
}
