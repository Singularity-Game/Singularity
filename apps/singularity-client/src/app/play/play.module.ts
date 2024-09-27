import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayComponent } from './play.component';
import { PlayRoutingModule } from './play-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SongGridItemComponent } from './song-grid-item/song-grid-item.component';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { SingularityUiModule } from '@singularity/ui';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SongCarouselComponent } from './song-carousel/song-carousel.component';

@NgModule({
  declarations: [PlayComponent, SongGridItemComponent, SongCarouselComponent],
  imports: [CommonModule, PlayRoutingModule, SharedModule, FormsModule, TranslocoModule, SingularityUiModule, CarouselModule]
})
export class PlayModule {
}
