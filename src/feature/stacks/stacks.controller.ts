import { Body, Controller, Post } from '@nestjs/common';
import { NewStackDTO } from 'src/DTO/NewStackDTO';
import { StacksService } from './stacks.service';

@Controller('stacks')
export class StacksController {

    constructor(private stackService: StacksService) { }

    @Post("create")
    createStack(@Body() req: NewStackDTO) {
        return this.stackService.createNewStack(req)
    }

    @Post("getUserStacksSummary")
    getUserStacksSummary(@Body("userId") userId: string) {
        return this.stackService.getUserStacksSummary(userId)
    }

    @Post("getAllStacks")
    getAllStacks(@Body("userId") userId: string) {
        return this.stackService.getAllStacks(userId)
    }
}
