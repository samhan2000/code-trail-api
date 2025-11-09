import { Body, Controller, Post } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { NewStackDTO } from 'src/DTO/NewStackDTO';
import { NewModuleDTO } from 'src/DTO/NewModuleDTO';

@Controller('modules')
export class ModulesController {

    constructor(private moduleService: ModulesService) { }

    @Post("create")
    create(@Body() req: NewModuleDTO) {
        return this.moduleService.createNewModule(req)
    }

    @Post("getModulesByStackId")
    getModulesByStackId(@Body() req) {
        return this.moduleService.getModulesByStackId(req)
    }
}
