import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { SongOverviewDto } from '@singularity/api-interfaces';
import { SongService } from '../shared/song.service';
import { SettingsService } from '../shared/settings/settings.service';
import { LocalSettings } from '../shared/settings/local-settings';
import { DragScrollComponent } from 'ngx-drag-scroll';

@Component({
  selector: 'singularity-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss'],
})
export class PlayComponent implements OnInit {
  public songs$?: Observable<SongOverviewDto[]>;
  public isOfflineMode?: boolean;
  public searchTerm = '';
  public orderBy: { key: keyof SongOverviewDto, ascending: boolean } = { key: 'name', ascending: true };
  public visibleCarouselItems = window.innerWidth / 270 + 3;
  public carouselIndex = 0;
  public isScrolled = false;

  @ViewChild(DragScrollComponent) carousel?: DragScrollComponent;

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
              private readonly settingsService: SettingsService) {}

  public ngOnInit(): void {
    this.isOfflineMode = this.settingsService.getLocalSetting(LocalSettings.OfflineMode) === 'true'

    console.log(this.visibleCarouselItems, window.innerWidth);

    if (this.isOfflineMode) {
      this.songs$ = this.songService.getAllOfflineSongs$().pipe(shareReplay(1));
    } else {
      this.songs$ = this.songService.getAllSongs$().pipe(shareReplay(1));
    }
  }
}
