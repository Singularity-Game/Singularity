import { Component, OnDestroy, OnInit } from '@angular/core';
import { PartyService } from '../party.service';
import { filter, map, Observable, ReplaySubject, Subject, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs';
import { Nullable, Optional, PartyDto, PartyQueueItemDto } from '@singularity/api-interfaces';

@Component({
  selector: 'singularity-party-tv-view',
  templateUrl: './party-t-v-view.component.html',
  styleUrl: './party-t-v-view.component.scss'
})
export class PartyTVViewComponent implements OnInit, OnDestroy {
  public partySubject = new ReplaySubject<Optional<PartyDto>>(1);
  public upNextQueueItem$?: Observable<Nullable<PartyQueueItemDto>>;
  public currentSong$?: Observable<Nullable<PartyQueueItemDto>>;

  private readySubject = new Subject<void>();

  private destroySubject = new Subject<void>();

  constructor(private readonly partyService: PartyService) {
  }

  public ngOnInit() {
    this.partyService.getMyParty$().pipe(
      map(value => new Optional(value)),
      takeUntil(this.destroySubject)
    ).subscribe((value) => {
      this.partySubject.next(value);
    });

    this.upNextQueueItem$ = this.partySubject.pipe(
      filter((party: Optional<PartyDto>) => party.hasValue()),
      switchMap((party: Optional<PartyDto>) => this.partyService.getPartyQueue$(party.value!.id)),
      map((queue: PartyQueueItemDto[]) => {
        if (queue.length === 0) {
          return null;
        }

        return queue.find((queueItem: PartyQueueItemDto) => queueItem.ready) ?? null;
      })
    );

    this.currentSong$ = this.readySubject.pipe(
      withLatestFrom(this.upNextQueueItem$),
      map((value: [void, Nullable<PartyQueueItemDto>]) => value[1] === null ? null : { ...value[1] }),
      tap((value) => console.log('test', value))
    )
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
    this.partySubject.complete();
  }

  public setParty(party: PartyDto): void {
    this.partySubject.next(new Optional(party));
  }

  public ready(): void {
    this.readySubject.next();
  }
}
