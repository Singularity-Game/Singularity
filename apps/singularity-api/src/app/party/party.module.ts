import { Module } from '@nestjs/common';
import { PartyController } from './party.controller';
import { PartyService } from './party.service';
import { PartyProfile } from './automapper-profiles/party.profile';
import { SongModule } from '../song/song.module';

@Module({
  controllers: [PartyController],
  providers: [PartyService, PartyProfile],
  imports: [SongModule]
})
export class PartyModule {}
