import { Component, OnInit } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { SongOverviewDto } from '@singularity/api-interfaces';
import { SongService } from '../shared/song.service';
import { SettingsService } from '../shared/settings/settings.service';
import { LocalSettings } from '../shared/settings/local-settings';

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

  constructor(private readonly songService: SongService,
              private readonly settingsService: SettingsService) {}

  public ngOnInit(): void {
    this.isOfflineMode = this.settingsService.getLocalSetting(LocalSettings.OfflineMode) === 'true'

    if (this.isOfflineMode) {
      this.songs$ = this.songService.getAllOfflineSongs$().pipe(shareReplay(1));
    } else {
      this.songs$ = this.songService.getAllSongs$().pipe(shareReplay(1));
    }
  }
}
