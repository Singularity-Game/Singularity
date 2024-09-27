import { Component, Input, OnInit } from '@angular/core';
import { PartyDto, SongOverviewDto } from '@singularity/api-interfaces';
import { SongService } from '../../../shared/song.service';
import { map, Observable, shareReplay } from 'rxjs';
import { LocalSettings } from '../../../shared/settings/local-settings';
import { SettingsService } from '../../../shared/settings/settings.service';

@Component({
  selector: "singularity-party-lobby",
  templateUrl: "./party-lobby.component.html",
  styleUrl: "./party-lobby.component.scss"
})
export class PartyLobbyComponent implements OnInit {
  @Input() party?: PartyDto;

  public songs$?: Observable<SongOverviewDto[]>;
  public startIndex$?: Observable<number>;

  public link?: string;
  public volume = +(this.settingsService.getLocalSetting(LocalSettings.MenuVolume) || '0');

  constructor(private readonly songService: SongService,
              private readonly settingsService: SettingsService) {
  }

  public ngOnInit(): void {
    this.songs$ = this.songService.getAllSongs$().pipe(shareReplay(1));
    this.startIndex$ = this.songs$.pipe(map((songs: SongOverviewDto[]) => Math.floor(Math.random() * songs.length)));

    this.link = `${window.location.origin}/party/${this.party?.id}`
  }
}
