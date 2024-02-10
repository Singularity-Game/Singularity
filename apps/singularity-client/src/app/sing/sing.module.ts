import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VocalGridComponent } from './sing/vocal-grid/vocal-grid.component';
import { TuiButtonModule, TuiHostedDropdownModule, TuiNotificationModule, TuiSvgModule } from '@taiga-ui/core';
import { BpmService } from './services/bpm.service';
import { SingComponent } from './sing/sing.component';
import { SingPageRoutingModule } from './sing-routing.module';
import { SingPageComponent } from './sing-page.component';
import { LyricsComponent } from './sing/lyrics/lyrics.component';
import { MicrophoneService } from './services/microphone.service';
import {
  MicrophoneSelectionDialogComponent
} from './dialogs/microphone-selection-dialog/microphone-selection-dialog.component';
import { MicrophoneGuard } from './guards/microphone.guard';
import {
  TuiDataListWrapperModule,
  TuiIslandModule,
  TuiProgressModule,
  TuiSelectModule,
  TuiSelectOptionModule
} from '@taiga-ui/kit';
import { ReactiveFormsModule } from '@angular/forms';
import {
  AudioContextActivationDialogComponent
} from './dialogs/audio-context-activation-dialog/audio-context-activation-dialog.component';
import { AudioContextGuard } from './guards/audio-context.guard';
import { SingerFactory } from './services/singer-factory.service';
import { SharedModule } from '../shared/shared.module';
import { SingScoreDialogComponent } from './dialogs/sing-score-dialog/sing-score-dialog.component';
import { ScoreTitlePipe } from './pipes/score-title.pipe';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [
    VocalGridComponent,
    SingComponent,
    LyricsComponent,
    SingPageComponent,
    MicrophoneSelectionDialogComponent,
    AudioContextActivationDialogComponent,
    SingScoreDialogComponent,
    ScoreTitlePipe
  ],
  imports: [
    SingPageRoutingModule,
    CommonModule,
    TuiButtonModule,
    TuiHostedDropdownModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiProgressModule,
    ReactiveFormsModule,
    TuiSelectOptionModule,
    TuiSvgModule,
    SharedModule,
    TuiIslandModule,
    TuiNotificationModule,
    TranslocoModule
  ],
  providers: [
    BpmService,
    MicrophoneService,
    MicrophoneGuard,
    AudioContextGuard,
    SingerFactory
  ],
  exports: [SingComponent],
})
export class SingModule {}
