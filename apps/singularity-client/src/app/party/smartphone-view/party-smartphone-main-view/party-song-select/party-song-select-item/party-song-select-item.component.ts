import { Component, Input } from '@angular/core';
import { PartyDto, PartyParticipantDto, SongOverviewDto } from '@singularity/api-interfaces';
import { PartyService } from '../../../../party.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[singularity-party-song-select-item]',
  templateUrl: './party-song-select-item.component.html',
  styleUrl: './party-song-select-item.component.scss'
})
export class PartySongSelectItemComponent {
  @Input() party?: PartyDto;
  @Input() song?: SongOverviewDto;
  @Input() participant?: PartyParticipantDto;

  constructor(private readonly partyService: PartyService) {
  }

  public addSong(): void {
    if(!this.party || !this.song || !this.participant) {
      return;
    }

    this.partyService.queueSong$(this.party.id, this.song, this.participant).subscribe();
  }
}
