import { Component, Input, OnInit } from '@angular/core';
import { SongOverviewDto } from '@singularity/api-interfaces';
import { Observable, startWith, take } from 'rxjs';
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
  public isDownloaded$?: Observable<boolean>;

  constructor(private readonly songService: SongService,
              private readonly router: Router) {
  }

  public ngOnInit(): void {
    console.log('init!');
    if(!this.song) {
      return;
    }

    this.cover$ = this.songService.getSongCoverCached$(this.song.id)
      .pipe(startWith(''));

    this.isDownloaded$ = this.songService.isSongDownloaded$(this.song.id).pipe(take(1));
  }

  public startSinging() {
    this.router.navigate(['sing', this.song?.id], {
      queryParams: {
        referer: 'play'
      }
    });
  }
}
