import { Component, Input, OnInit } from '@angular/core';
import { SongOverviewDto } from '@singularity/api-interfaces';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { SongService } from '../../shared/song.service';
import { Router } from '@angular/router';

@Component({
  selector: 'singularity-song-grid-item',
  templateUrl: './song-grid-item.component.html',
  styleUrls: ['./song-grid-item.component.scss'],
})
export class SongGridItemComponent implements OnInit {
  @Input() song?: SongOverviewDto;

  public cover$?: Observable<string>;
  public blurryCover$?: Observable<string>;
  public isDownloaded$?: Observable<boolean>;

  constructor(private readonly songService: SongService,
              private readonly router: Router) {
  }

  public ngOnInit(): void {
    if(!this.song) {
      return;
    }

    this.isDownloaded$ = this.songService.isSongDownloaded$(this.song.id).pipe(take(1));
    this.cover$ = this.isDownloaded$.pipe(
      switchMap((downloaded: boolean) => {
        if (downloaded) {
          return this.songService.getSongCoverCached$(this.song?.id ?? 0);
        } else {
          return of(`/api/song/${this.song?.id}/cover`);
        }
      })
    );

    this.blurryCover$ = this.isDownloaded$.pipe(
      map((downloaded: boolean) => {
        if (downloaded) {
          return '';
        } else {
          return `/api/song/${this.song?.id}/cover/small`;
        }
      })
    )
  }

  public startSinging() {
    this.router.navigate(['sing', this.song?.id], {
      queryParams: {
        referer: 'play'
      }
    });
  }
}
