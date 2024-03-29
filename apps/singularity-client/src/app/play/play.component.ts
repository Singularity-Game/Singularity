import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { map, Observable, of, shareReplay, Subject, switchMap, takeUntil } from 'rxjs';
import { SongOverviewDto } from '@singularity/api-interfaces';
import { SongService } from '../shared/song.service';
import { SettingsService } from '../shared/settings/settings.service';
import { LocalSettings } from '../shared/settings/local-settings';
import { SuiGlobalColorService } from '@singularity/ui';
import { SongCarouselComponent } from './song-carousel/song-carousel.component';

@Component({
  selector: 'singularity-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit, OnDestroy {
  public songs$?: Observable<SongOverviewDto[]>;
  public isOfflineMode?: boolean;
  public searchTerm = '';
  public orderBy: { key: keyof SongOverviewDto, ascending: boolean } = { key: 'name', ascending: true };
  public carouselIndex = 0;
  public isScrolled = false;
  public paused = false;
  public volume = +(this.settingsService.getLocalSetting(LocalSettings.MenuVolume) || '0');

  private destroySubject = new Subject<void>();

  @ViewChild(SongCarouselComponent) private carousel?: SongCarouselComponent;

  @HostListener('window:scroll')
  public onScroll(): void {
    const verticalOffset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    if (verticalOffset === 0 && this.isScrolled) {
      this.isScrolled = false;
      return;
    }

    if (verticalOffset !== 0 && !this.isScrolled) {
      this.isScrolled = true;
      return;
    }
  }

  constructor(private readonly songService: SongService,
              private readonly settingsService: SettingsService,
              private readonly suiColorService: SuiGlobalColorService) {
  }

  public ngOnInit(): void {
    this.isOfflineMode = this.settingsService.getLocalSetting(LocalSettings.OfflineMode) === 'true';

    if (this.isOfflineMode) {
      this.songs$ = this.songService.getAllOfflineSongs$().pipe(shareReplay(1));
    } else {
      this.songs$ = this.songService.getAllSongs$().pipe(shareReplay(1));
    }
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public next(): void {
    this.paused = false;
    this.carousel?.next();
  }

  public previous(): void {
    this.paused = false;
    this.carousel?.previous();
  }

  public onCarouselChange(index: number, songs: SongOverviewDto[]) {
    this.carouselIndex = index;
    const currentSong = songs[index];

    this.songService.isSongDownloaded$(currentSong.id)
      .pipe(
        switchMap((downloaded: boolean) => {
          if (downloaded) {
            return this.songService.getSongCoverCached$(currentSong.id);
          } else {
            return of(`/api/song/${currentSong.id}/cover`);
          }
        }),
        map((cover: string | Blob) => {
          if (cover instanceof Blob) {
            return URL.createObjectURL(cover);
          } else {
            return cover;
          }
        }),
        takeUntil(this.destroySubject)
      ).subscribe((cover: string) => {
      this.suiColorService.setColorsFromImage(cover);
    });
  }
}
