import { Injectable } from '@angular/core';
import { Nullable } from '@singularity/api-interfaces';
import { LocalSettings } from './local-settings';
import { filter, map, Observable, startWith, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private readonly settingsSubject = new Subject<{ key: LocalSettings, value: Nullable<string> }>();

  constructor() {
    this.setLocalDefaultSettings();
  }

  public setLocalSetting(key: LocalSettings, value: string): void {
    localStorage.setItem(key, value);

    this.settingsSubject.next({ key: key, value: value });
  }

  public getLocalSetting(key: LocalSettings): Nullable<string> {
    return localStorage.getItem(key);
  }

  public getLocalSetting$(key: LocalSettings): Observable<Nullable<string>> {
    return this.settingsSubject.pipe(
      filter((pair) => pair.key === key),
      map((pair) => pair.value),
      startWith(this.getLocalSetting(key))
    );
  }

  private setLocalDefaultSettings(): void {
    if (this.getLocalSetting(LocalSettings.MicrophoneLatency) === null) {
      this.setLocalSetting(LocalSettings.MicrophoneLatency, '90');
    }

    if (this.getLocalSetting(LocalSettings.DarkMode) === null) {
      this.setLocalSetting(LocalSettings.DarkMode, 'true');
    }

    if (this.getLocalSetting(LocalSettings.OfflineMode) === null) {
      this.setLocalSetting(LocalSettings.OfflineMode, 'false');
    }

    if (this.getLocalSetting(LocalSettings.MenuVolume) === null) {
      this.setLocalSetting(LocalSettings.MenuVolume, '10');
    }

    if (this.getLocalSetting(LocalSettings.GameVolume) === null) {
      this.setLocalSetting(LocalSettings.GameVolume, '100');
    }
  }
}
