import { AfterViewInit, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { SongOverviewDto } from '@singularity/api-interfaces';
import { SongService } from '../shared/song.service';
import { SettingsService } from '../shared/settings/settings.service';
import { LocalSettings } from '../shared/settings/local-settings';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { SuiGlobalColorService } from '@singularity/ui';
@Component({
  selector: 'singularity-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit, AfterViewInit, OnDestroy {
  public songs$?: Observable<SongOverviewDto[]>;
  public isOfflineMode?: boolean;
  public searchTerm = '';
  public orderBy: { key: keyof SongOverviewDto, ascending: boolean } = { key: 'name', ascending: true };
  public visibleCarouselItems = window.innerWidth / 270 + 3;
  public carouselIndex = 0;
  public isScrolled = false;
  public paused = false;

  private audio = new Audio();

  @ViewChild(DragScrollComponent) private carousel?: DragScrollComponent;

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

  @HostListener('window:keyup', ['$event'])
  public onKeyDown(event: KeyboardEvent): void {
    if(!this.carousel || this.isScrolled) {
      return;
    }

    if (event.key === 'ArrowRight') {
      this.carousel.moveRight();
    }

    if (event.key === 'ArrowLeft') {
      this.carousel.moveLeft();
    }
  }

  constructor(private readonly songService: SongService,
              private readonly settingsService: SettingsService,
              private readonly suiColorService: SuiGlobalColorService) {}

  public ngOnInit(): void {
    this.isOfflineMode = this.settingsService.getLocalSetting(LocalSettings.OfflineMode) === 'true'

    if (this.isOfflineMode) {
      this.songs$ = this.songService.getAllOfflineSongs$().pipe(shareReplay(1));
    } else {
      this.songs$ = this.songService.getAllSongs$().pipe(shareReplay(1));
    }
  }

  public ngAfterViewInit() {
    this.skip();
    this.previous();
  }

  public ngOnDestroy(): void {
    this.audio.pause();
    this.audio.src = '';
  }

  public skip(): void {
    this.carousel?.moveRight();
  }

  public previous(): void {
    this.carousel?.moveLeft();
  }

  public onCarouselIndexChange(index: number, songs: SongOverviewDto[]): void {
    this.carouselIndex = index;
    const song = songs[index];

    this.suiColorService.setColorsFromImage(`/api/song/${song.id}/cover`);
  }
}
