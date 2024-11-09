import { Component, OnInit } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { PartyDto, PartyParticipantDto, PartyQueueItemDto, SongOverviewDto } from '@singularity/api-interfaces';
import { ActivatedRoute } from '@angular/router';
import { PartyService } from '../../../party.service';
import { PartyParticipantService } from '../../../party-participant.service';

@Component({
  selector: 'singularity-party-song-select',
  templateUrl: './party-smartphone-home.component.html',
  styleUrl: './party-smartphone-home.component.scss'
})
export class PartySmartphoneHomeComponent implements OnInit {
  public songs$?: Observable<SongOverviewDto[]>;
  public party$?: Observable<PartyDto>;
  public partyParticipant$?: Observable<PartyParticipantDto>;
  public queue$?: Observable<PartyQueueItemDto[]>;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly partyService: PartyService,
              private readonly partyParticipantService: PartyParticipantService) {
  }

  public ngOnInit(): void {
    const partyId = this.activatedRoute.snapshot.paramMap.get('id');

    this.party$ = this.partyService.getPartyById$(partyId ?? '')
      .pipe(filter(value => !!value)) as Observable<PartyDto>;

    this.songs$ = this.partyService.getPartySongs$(partyId ?? '')
      .pipe(map((songs: SongOverviewDto[]) => songs.sort((songA: SongOverviewDto, songB: SongOverviewDto) => songA.name.localeCompare(songB.name))));

    this.queue$ = this.partyService.getPartyQueue$(partyId ?? '');

    this.partyParticipant$ = this.partyParticipantService.getMe$().pipe(filter(value => !!value)) as Observable<PartyParticipantDto>;
  }
}
