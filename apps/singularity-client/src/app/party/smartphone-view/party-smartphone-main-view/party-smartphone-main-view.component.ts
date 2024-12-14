import { Component, OnInit } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { PartyDto, PartyParticipantDto } from '@singularity/api-interfaces';
import { ActivatedRoute } from '@angular/router';
import { PartyService } from '../../party.service';
import { PartyParticipantService } from '../../party-participant.service';

@Component({
  selector: 'singularity-party-smartphone-main-view',
  templateUrl: './party-smartphone-main-view.component.html',
  styleUrl: './party-smartphone-main-view.component.scss'
})
export class PartySmartphoneMainViewComponent implements OnInit {
  public party$?: Observable<PartyDto>;
  public participant$?: Observable<PartyParticipantDto>;

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly partyService: PartyService,
              private readonly partyParticipantService: PartyParticipantService) {
  }

  public ngOnInit(): void {
    const partyId = this.activatedRoute.snapshot.paramMap.get('id');

    this.party$ = this.partyService.getPartyById$(partyId ?? '')
      .pipe(filter(value => !!value)) as Observable<PartyDto>;
    this.participant$ = this.partyParticipantService.getMe$()
      .pipe(filter(value => !!value)) as Observable<PartyParticipantDto>;
  }

}
