import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongsRoutingModule } from './songs-routing.module';
import { SongListComponent } from './song-list/song-list.component';
import { TuiButtonModule, TuiHintModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { CreateSongComponent } from './create-song/create-song.component';
import { TuiAvatarModule, TuiInputFilesModule, TuiIslandModule, TuiProgressModule } from '@taiga-ui/kit';
import { ReactiveFormsModule } from '@angular/forms';
import { SongManagementService } from './song-management.service';
import { SongListItemComponent } from './song-list/song-list-item/song-list-item.component';
import { SingModule } from '../../sing/sing.module';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [SongListComponent, SongListItemComponent, CreateSongComponent],
  imports: [CommonModule, SongsRoutingModule, TuiButtonModule, TuiAvatarModule, TuiIslandModule, TuiInputFilesModule, ReactiveFormsModule, SingModule, TuiSvgModule, TuiLoaderModule, TuiHintModule, TuiProgressModule, TranslocoModule],
  providers: [SongManagementService]
})
export class SongsModule {}
