import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
    constructor(private readonly prisma: PrismaService) { }

    async search(userId: string, query: string) {
        console.log(query, typeof query)
        if (!query?.trim()) return []

        const searchTerm = query.trim()

        const results = await this.prisma.$queryRawUnsafe(`
      SELECT 'stack' AS type, id, name, description, slug
      FROM "stack"
      WHERE "user_id" = $1
        AND to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
        @@ plainto_tsquery('english', $2)

      UNION ALL

      SELECT 'module' AS type, id, name, description, slug
      FROM "module"
      WHERE "user_id" = $1
        AND to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
        @@ plainto_tsquery('english', $2)

      UNION ALL

      SELECT 'lesson' AS type, id, title AS name, description, slug
      FROM "lesson"
      WHERE "user_id" = $1
        AND to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
        @@ plainto_tsquery('english', $2)
    `, userId, searchTerm)

        return results
    }
}
