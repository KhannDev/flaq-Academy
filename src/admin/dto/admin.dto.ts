import { CampaignStatus } from 'aws-sdk/clients/pinpoint';
import { IsEnum, IsMongoId, IsString, isString } from 'class-validator';

export class addCampaigntoLvl2Dto {
  @IsMongoId()
  campaignId: string;
  @IsMongoId()
  level2Id: string;
  @IsEnum({ Rejected: 'Rejected', Approved: 'Approved' })
  status: CampaignStatus;
}
