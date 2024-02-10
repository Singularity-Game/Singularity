import { Component } from '@angular/core';
import { Nullable } from '@singularity/api-interfaces';
import { SettingsService } from '../../shared/settings/settings.service';
import { LocalSettings } from '../../shared/settings/local-settings';
import { SongService } from '../../shared/song.service';
import { take } from 'rxjs';

@Component({
  selector: 'singularity-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  private cachedMicrophoneLatency: Nullable<number> = null;
  private cachedDarkMode: Nullable<boolean> = null;
  private cachedOfflineMode: Nullable<boolean> = null;

  public get microphoneLatency(): number {
    if (this.cachedMicrophoneLatency === null) {
      this.cachedMicrophoneLatency = +(this.settingsService.getLocalSetting(LocalSettings.MicrophoneLatency) ?? 0);
    }

    return this.cachedMicrophoneLatency;
  }

  public set microphoneLatency(latency: Nullable<number>) {
    if (latency === null) {
      latency = 0;
    }

    this.cachedMicrophoneLatency = latency;
    this.settingsService.setLocalSetting(LocalSettings.MicrophoneLatency, `${latency}`);
  }

  public get darkMode(): boolean {
    if (this.cachedDarkMode === null) {
      this.cachedDarkMode = this.settingsService.getLocalSetting(LocalSettings.DarkMode) === 'true';
    }

    return this.cachedDarkMode;
  }

  public set darkMode(darkMode: boolean) {
    this.cachedDarkMode = darkMode;
    this.settingsService.setLocalSetting(LocalSettings.DarkMode, `${darkMode}`);
  }

  public get offlineMode(): boolean {
    if (this.cachedOfflineMode === null) {
      this.cachedOfflineMode = this.settingsService.getLocalSetting(LocalSettings.OfflineMode) === 'true';
    }

    return this.cachedOfflineMode;
  }

  public set offlineMode(offlineMode: boolean) {
    this.cachedOfflineMode = offlineMode;
    this.settingsService.setLocalSetting(LocalSettings.OfflineMode, `${offlineMode}`);
  }

  public usedStorageSpace: Nullable<number> = null;
  public totalStorageSpace: Nullable<number> = null;
  public storageSpaceProgress: Nullable<number> = null;
  public isClearingSongs = false;

  constructor(private readonly settingsService: SettingsService,
              private readonly songService: SongService) {
    this.estimateStorageSpace();
  }

  private estimateStorageSpace(): void {
    navigator.storage.estimate().then((result: StorageEstimate) => {
      this.usedStorageSpace = result.usage ?? 0;
      this.totalStorageSpace = result.quota ?? 0;
      this.storageSpaceProgress = this.usedStorageSpace / this.totalStorageSpace * 100;
    });
  }

  public clearSongs(): void {
    this.isClearingSongs = true

    this.songService.clearSongs$()
      .pipe(take(1))
      .subscribe(() => {
        this.isClearingSongs = false;
        this.estimateStorageSpace();
      });
  }
}
