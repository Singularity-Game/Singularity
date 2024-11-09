import { Component, Input, OnInit } from '@angular/core';
import { PartyDto, SongOverviewDto } from '@singularity/api-interfaces';
import { SuiGlobalColorService } from '@singularity/ui';
import { Observable, tap } from 'rxjs';
import { PartyService } from '../../../party.service';

@Component({
  selector: 'singularity-party-smartphone-header',
  templateUrl: './party-smartphone-header.component.html',
  styleUrl: './party-smartphone-header.component.scss'
})
export class PartySmartphoneHeaderComponent implements OnInit {
  @Input() party?: PartyDto;

  public currentSong$?: Observable<SongOverviewDto>

  constructor(private readonly partyService: PartyService,
              private readonly colorService: SuiGlobalColorService) {
  }

  public ngOnInit(): void {
    if(!this.party) {
      return;
    }

    this.currentSong$ = this.partyService.getCurrentSong$(this.party.id)
      .pipe(
        tap((song: SongOverviewDto) => {
          this.colorService.setColorsFromImage(`/api/party/${this.party?.id}/songs/${song.id}/cover`)
          // this.changeDetector.detectChanges();
        })
      );
  }
}
