import { Module } from '@nestjs/common';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';
import { PartyProfile } from './automapper-profiles/party.profile';
import { SongModule } from '../song/song.module';
import { PartyParticipantProfile } from './automapper-profiles/party-participant.profile';
import { PartyQueueItemProfile } from './automapper-profiles/party-queue-item.profile';

@Module({
  controllers: [PartyController],
  providers: [PartyService, PartyProfile, PartyParticipantProfile, PartyQueueItemProfile],
  imports: [SongModule]
})
export class PartyModule {}
