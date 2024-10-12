import { Component, OnDestroy, OnInit } from '@angular/core';
import { PartyService } from '../party.service';
import { map, Subject, takeUntil } from 'rxjs';
import { Optional, PartyDto } from '@singularity/api-interfaces';

@Component({
  selector: 'singularity-party-tv-view',
  templateUrl: './party-t-v-view.component.html',
  styleUrl: './party-t-v-view.component.scss'
})
export class PartyTVViewComponent implements OnInit, OnDestroy {
  public partySubject = new Subject<Optional<PartyDto>>();

  private destroySubject = new Subject<void>()
  
  constructor(private readonly partyService: PartyService) {
  }
  
  public ngOnInit() {
    this.partyService.getMyParty$().pipe(
      map(value => new Optional(value)),
      takeUntil(this.destroySubject)
    ).subscribe((value) => {
      this.partySubject.next(value);
    })
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
    this.partySubject.complete();
  }

  public setParty(party: PartyDto): void {
    this.partySubject.next(new Optional(party));
  }
}
