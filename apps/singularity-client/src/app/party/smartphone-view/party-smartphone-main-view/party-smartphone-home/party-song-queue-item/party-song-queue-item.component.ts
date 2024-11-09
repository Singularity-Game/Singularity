import { Component, Input } from '@angular/core';
import { PartyDto, PartyParticipantDto, PartyQueueItemDto, SongOverviewDto } from '@singularity/api-interfaces';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[singularity-party-song-queue-item]',
  templateUrl: './party-song-queue-item.component.html',
  styleUrl: './party-song-queue-item.component.scss'
})
export class PartySongQueueItemComponent {
  @Input() party?: PartyDto;
  @Input() queueItem?: PartyQueueItemDto;
  @Input() participant?: PartyParticipantDto;
}
