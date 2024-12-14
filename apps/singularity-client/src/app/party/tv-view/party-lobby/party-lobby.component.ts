import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Nullable, PartyDto, PartyQueueItemDto, SongOverviewDto } from '@singularity/api-interfaces';
import { SongService } from '../../../shared/song.service';
import { Observable, shareReplay, Subject, takeUntil, tap } from 'rxjs';
import { LocalSettings } from '../../../shared/settings/local-settings';
import { SettingsService } from '../../../shared/settings/settings.service';
import { PartyService } from '../../party.service';

@Component({
  selector: "singularity-party-lobby",
  templateUrl: "./party-lobby.component.html",
  styleUrl: "./party-lobby.component.scss"
})
export class PartyLobbyComponent implements OnInit, OnDestroy {
  @Input() party?: PartyDto;
  @Input() upNextQueueItem: Nullable<PartyQueueItemDto> = null;

  @Output() ready = new EventEmitter<void>();

  public songs$?: Observable<SongOverviewDto[]>;


  public index = 0;

  public link?: string;
  public volume = +(this.settingsService.getLocalSetting(LocalSettings.MenuVolume) || '0');
  public timeRemaining = 0;

  private destroySubject = new Subject<void>();

  constructor(private readonly songService: SongService,
              private readonly settingsService: SettingsService,
              private readonly partyService: PartyService) {
  }

  public ngOnInit(): void {
    if(!this.party) {
      return;
    }

    this.songs$ = this.songService.getAllSongs$()
      .pipe(
        tap((songs: SongOverviewDto[]) => this.setNextSong(songs)),
        shareReplay(1)
      );

    this.link = `${window.location.origin}/party/${this.party.id}`;
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public setNextSong(songs: SongOverviewDto[]): void {
    this.ready.next();

    let currentIndex = this.index;
    while(currentIndex === this.index && songs.length > 1) {
      currentIndex = Math.floor(Math.random() * songs.length);
    }

    this.index = currentIndex;
    this.partyService.setCurrentSong$(songs[this.index]).pipe(takeUntil(this.destroySubject)).subscribe();
  }

  protected readonly Math = Math;
}
