import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongsRoutingModule } from './songs-routing.module';
import { SongListComponent } from './song-list/song-list.component';
import { CreateSongComponent } from './create-song/create-song.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SongManagementService } from './song-management.service';
import { SongListItemComponent } from './song-list/song-list-item/song-list-item.component';
import { SingModule } from '../../sing/sing.module';
import { TranslocoModule } from '@ngneat/transloco';
import {
  CreateSongUplodadTxtFileComponentComponent
} from './create-song/create-song-uplodad-txt-file-component/create-song-uplodad-txt-file-component.component';
import { SingularityUiModule } from '@singularity/ui';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [SongListComponent, SongListItemComponent, CreateSongComponent, CreateSongUplodadTxtFileComponentComponent],
  imports: [CommonModule, SongsRoutingModule, ReactiveFormsModule, SingModule, TranslocoModule, FormsModule, SingularityUiModule, SharedModule],
  providers: [SongManagementService]
})
export class SongsModule {}
