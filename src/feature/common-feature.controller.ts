import { Body, Controller, Post } from '@nestjs/common';
import { CommonFeatureService } from './common-feature.service';

@Controller('feature')
export class CommonFeatureController {

    constructor(private commonService: CommonFeatureService) { }

    @Post("getDashboardContent")
    getDashboardContent(@Body("userId") userId: string) {
        return this.commonService.getDashboardContent(userId)
    }
}
