import { Module } from '@nestjs/common';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';
import { PartyMapper } from './mapper/party-mapper.service';
import { SongModule } from '../song/song.module';
import { PartyParticipantMapper } from './mapper/party-participant-mapper.service';
import { PartyQueueItemMapper } from './mapper/party-queue-item-mapper.service';

@Module({
  controllers: [PartyController],
  providers: [PartyService, PartyMapper, PartyParticipantMapper, PartyQueueItemMapper],
  imports: [SongModule]
})
export class PartyModule {}
