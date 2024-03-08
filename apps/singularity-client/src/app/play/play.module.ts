import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayComponent } from './play.component';
import { PlayRoutingModule } from './play-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SongGridItemComponent } from './song-grid-item/song-grid-item.component';
import { TuiAvatarModule, TuiInputModule, TuiSelectModule, TuiSliderModule } from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHintModule,
  TuiNotificationModule, TuiScrollbarModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { TuiMediaModule } from '@taiga-ui/cdk';
import { TranslocoModule } from '@ngneat/transloco';
import { SingularityUiModule } from '@singularity/ui';

@NgModule({
  declarations: [PlayComponent, SongGridItemComponent, AudioPlayerComponent],
  imports: [CommonModule, PlayRoutingModule, SharedModule, TuiAvatarModule, TuiSvgModule, TuiHintModule, TuiNotificationModule, TuiInputModule, TuiTextfieldControllerModule, FormsModule, TuiSelectModule, TuiDataListModule, TuiScrollbarModule, TuiMediaModule, TuiSliderModule, TuiButtonModule, TranslocoModule, SingularityUiModule]
})
export class PlayModule {}
