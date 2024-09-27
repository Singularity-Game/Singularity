import { Module } from '@nestjs/common';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';
import { PartyProfile } from './automapper-profiles/party.profile';

@Module({
  controllers: [PartyController],
  providers: [PartyService, PartyProfile],
  imports: []
})
export class PartyModule {}
