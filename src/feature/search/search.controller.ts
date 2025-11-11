import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { CurrentUser } from 'src/oauth/decorator/currentUser';
import { JwtAuthGuard } from 'src/oauth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {
        console.log("Search controller loaded")
    }

    @Get()
    async search(@CurrentUser() user, @Query('q') q: string) {
        const userId = user.id
        return this.searchService.search(userId, q)
    }
}
