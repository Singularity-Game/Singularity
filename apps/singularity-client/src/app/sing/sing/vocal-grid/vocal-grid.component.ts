import { AfterViewInit, Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { SongDto } from '@singularity/api-interfaces';
import { BpmService } from '../../services/bpm.service';
import { combineLatest, Subject, take, takeUntil } from 'rxjs';
import { UiVocalGrid } from './models/ui-vocal-grid';
import Konva from 'konva';
import { Nullable } from '@singularity/api-interfaces';
import { NormalisedSingerNote } from '../../singer/normalised-singer-note';
import { Singer } from '../../singer/singer';
import { SettingsService } from '../../../shared/settings/settings.service';
import { LocalSettings } from '../../../shared/settings/local-settings';

@Component({
  selector: 'singularity-vocal-grid',
  templateUrl: './vocal-grid.component.html',
  styleUrls: ['./vocal-grid.component.scss'],
})
export class VocalGridComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input()
  public song?: SongDto;

  @Input()
  public singers: Singer[] = [];

  public width = 0;
  public height = 0;

  public stage?: Konva.Stage;

  private vocalGrid?: UiVocalGrid;
  private destroySubject = new Subject<void>();

  constructor(private readonly bpmService: BpmService, private readonly settingsService: SettingsService) {
  }

  @HostListener('window:resize', ['$event'])
  public onResize(): void {
    this.setDimensions();
  }

  public ngOnInit(): void {
    if (!this.song) {
      return;
    }

    const microphoneLatency = this.settingsService.getLocalSetting(LocalSettings.MicrophoneLatency);

    this.vocalGrid = new UiVocalGrid(this.song, this.singers, +(microphoneLatency ?? 0));
    this.setDimensions();

    combineLatest(this.singers.map((singer: Singer) => singer.getSingerNote$()))
      .pipe(takeUntil(this.destroySubject))
      .subscribe((notes: Nullable<NormalisedSingerNote>[]) => this.vocalGrid?.addNotes(notes));
  }

  public ngAfterViewInit(): void {
    this.setupCanvas();
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
    this.vocalGrid?.pause();
  }

  private setupCanvas(): void {
    this.stage = new Konva.Stage({
      container: 'stage',
      width: this.width,
      height: this.height
    });

    if (!this.song || !this.vocalGrid) {
      return;
    }

    const layer = this.vocalGrid.getLayer();
    this.stage.add(layer);

    this.bpmService.onStart$()
      .pipe(take(1))
      .subscribe(() => this.vocalGrid?.play());
  }

  private setDimensions(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

}

