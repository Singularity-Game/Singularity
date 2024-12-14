import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PartyQueueItemDto } from '@singularity/api-interfaces';
import { PartyService } from '../../party.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'singularity-party-sing',
  templateUrl: './party-sing.component.html',
  styleUrl: './party-sing.component.scss'
})
export class PartySingComponent implements OnInit, OnDestroy {
  @Input() set queueItem(queueItem: PartyQueueItemDto) {
    this.partyQueueItem = queueItem;
    this.initSong();
  }

  @Output() ready = new EventEmitter<void>();

  public countdown = 15;
  public partyQueueItem?: PartyQueueItemDto;

  private countdownInterval = setInterval(() => this.countdown--, 1000);
  private readonly destroySubject = new Subject<void>();

  constructor(private readonly partyService: PartyService) {
  }

  public ngOnInit(): void {
    this.initSong();
  }

  public ngOnDestroy() {
    clearInterval(this.countdownInterval);
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public songFinished(): void {
    this.ready.next();
  }

  private initSong(): void {
    if(!this.partyQueueItem) {
      return;
    }

    this.countdown = 15;
    this.partyService.setCurrentSong$(this.partyQueueItem.song)
      .pipe(takeUntil(this.destroySubject))
      .subscribe();
  }
}
