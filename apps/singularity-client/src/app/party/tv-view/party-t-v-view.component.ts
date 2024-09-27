import { Component, OnInit } from '@angular/core';
import { PartyService } from '../party.service';
import { map, Observable, of } from 'rxjs';
import { Nullable, Optional, PartyDto } from '@singularity/api-interfaces';

@Component({
  selector: 'singularity-party-tv-view',
  templateUrl: './party-t-v-view.component.html',
  styleUrl: './party-t-v-view.component.scss'
})
export class PartyTVViewComponent implements OnInit {
  public party$?: Observable<Optional<PartyDto>>;
  
  constructor(private readonly partyService: PartyService) {
  }
  
  public ngOnInit() {
    this.party$ = this.partyService.getMyParty$()
      .pipe(map(value => new Optional(value)));
  }
}
