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
import { TuiMediaModule } from '@taiga-ui/cdk';
import { TranslocoModule } from '@ngneat/transloco';
import { SingularityUiModule } from '@singularity/ui';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SongCarouselComponent } from './song-carousel/song-carousel.component';

@NgModule({
  declarations: [PlayComponent, SongGridItemComponent, AudioPlayerComponent, SongCarouselComponent],
  imports: [CommonModule, PlayRoutingModule, SharedModule, TuiAvatarModule, TuiSvgModule, TuiHintModule, TuiNotificationModule, TuiInputModule, TuiTextfieldControllerModule, FormsModule, TuiSelectModule, TuiDataListModule, TuiScrollbarModule, TuiMediaModule, TuiSliderModule, TuiButtonModule, TranslocoModule, SingularityUiModule, CarouselModule]
})
export class PlayModule {
}
