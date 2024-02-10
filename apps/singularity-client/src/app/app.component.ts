import { Component, OnInit } from '@angular/core';
import { SettingsService } from './shared/settings/settings.service';
import { map, Observable, shareReplay } from 'rxjs';
import { LocalSettings } from './shared/settings/local-settings';
import { Nullable } from '@singularity/api-interfaces';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'singularity-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  public darkMode$?: Observable<boolean>;

  constructor(private readonly settingsService: SettingsService) {
  }

  public async ngOnInit(): Promise<void> {
    this.darkMode$ = this.settingsService.getLocalSetting$(LocalSettings.DarkMode)
      .pipe(
        map((value: Nullable<string>) => value === 'true'),
        shareReplay(1)
      )
  }

  public prepareRoute(outlet: RouterOutlet): boolean {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
