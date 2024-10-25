import { Component, Input, OnInit } from '@angular/core';
import { PartyDto, SongOverviewDto } from '@singularity/api-interfaces';
import { PartyService } from '../../../party.service';
import { SuiGlobalColorService } from '@singularity/ui';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'singularity-party-song-select-header',
  templateUrl: './party-song-select-header.component.html',
  styleUrl: './party-song-select-header.component.scss'
})
export class PartySongSelectHeaderComponent implements OnInit {
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
