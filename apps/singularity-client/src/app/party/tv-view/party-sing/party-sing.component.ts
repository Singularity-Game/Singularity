import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PartyQueueItemDto } from '@singularity/api-interfaces';

@Component({
  selector: 'singularity-party-sing',
  templateUrl: './party-sing.component.html',
  styleUrl: './party-sing.component.scss'
})
export class PartySingComponent implements OnDestroy {
  @Input() set queueItem(queueItem: PartyQueueItemDto) {
    this.partyQueueItem = queueItem;
    this.countdown = 15;
    console.log('update');
  }

  @Output() ready = new EventEmitter<void>();

  public countdown = 15;
  public partyQueueItem?: PartyQueueItemDto;

  private countdownInterval = setInterval(() => this.countdown--, 1000);

  public ngOnDestroy() {
    clearInterval(this.countdownInterval);
  }

  public songFinished(): void {
    this.ready.next();
  }
}
