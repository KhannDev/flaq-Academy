import { Controller } from '@nestjs/common';
import { CreatorsService } from './creators.service';

@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsservice: CreatorsService) {}
  // create a campaign for creators( Set the status to Pipeline, and add the campaign Id to the creator)

  // Fetch all the campaigns for the creator

  //Fetch creator meta data
}
