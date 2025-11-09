import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            throw new NotFoundException("User not found")
        }

        return user
    }
}
