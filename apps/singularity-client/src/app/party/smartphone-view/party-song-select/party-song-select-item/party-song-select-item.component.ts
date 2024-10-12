import { Component, Input } from '@angular/core';
import { PartyDto, SongOverviewDto } from '@singularity/api-interfaces';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[singularity-party-song-select-item]',
  templateUrl: './party-song-select-item.component.html',
  styleUrl: './party-song-select-item.component.scss'
})
export class PartySongSelectItemComponent {
  @Input() party?: PartyDto;
  @Input() song?: SongOverviewDto;
}
