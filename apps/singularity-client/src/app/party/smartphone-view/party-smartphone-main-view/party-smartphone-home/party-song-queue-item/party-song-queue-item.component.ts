import { Component, Input, OnDestroy } from '@angular/core';
import { PartyDto, PartyParticipantDto, PartyQueueItemDto } from '@singularity/api-interfaces';
import { PartyService } from '../../../../party.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[singularity-party-song-queue-item]',
  templateUrl: './party-song-queue-item.component.html',
  styleUrl: './party-song-queue-item.component.scss'
})
export class PartySongQueueItemComponent implements OnDestroy {
  @Input() party?: PartyDto;
  @Input() queueItem?: PartyQueueItemDto;
  @Input() participant?: PartyParticipantDto;

  private destroySubject = new Subject<void>();

  constructor(private readonly partyService: PartyService) {
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public join(): void {
    if(!this.party || !this.queueItem || !this.participant) {
      return;
    }

    this.partyService.joinQueuedSong$(this.party.id, this.queueItem.id, this.participant)
      .pipe(takeUntil(this.destroySubject))
      .subscribe();
  }

  public leave(): void {
    if(!this.party || !this.queueItem || !this.participant) {
      return;
    }

    this.partyService.leaveQueuedSong$(this.party.id, this.queueItem.id, this.participant)
      .pipe(takeUntil(this.destroySubject))
      .subscribe();
  }
}
