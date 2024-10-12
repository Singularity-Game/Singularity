import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { PartyService } from './party.service';
import { from, map, Observable, switchMap } from 'rxjs';
import { SongService } from '../song/song.service';
import { SongOverviewDto } from '@singularity/api-interfaces';
import { Mapper } from '@automapper/core';
import { Song } from '../song/models/song.entity';
import { InjectMapper } from '@automapper/nestjs';

@WebSocketGateway({ namespace: 'party' })
export class PartyGateway {

  constructor(private readonly partyService: PartyService,
              private readonly songService: SongService,
              @InjectMapper() private readonly mapper: Mapper) {
  }

  @SubscribeMessage('current-song')
  handleEvent(@MessageBody() partyId: string): Observable<{ event: 'current-song', data: SongOverviewDto }> {
    console.log('test');
    console.log(partyId);

    return this.partyService.getPartyCurrentSongId$(partyId)
      .pipe(
        switchMap((value) => from(this.songService.getSongById(value))),
        map((value) => this.mapper.map(value, Song, SongOverviewDto)),
        map((value) => ({ event: 'current-song', data: value }))
      );
  }
}
