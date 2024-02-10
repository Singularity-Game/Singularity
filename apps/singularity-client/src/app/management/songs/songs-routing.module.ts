import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SongListComponent } from './song-list/song-list.component';
import { CreateSongComponent } from './create-song/create-song.component';
import { AdminGuard } from '../../shared/guards/admin.guard';

const routes: Routes = [
  { path: '', component: SongListComponent },
  { path: 'new', component: CreateSongComponent, canActivate: [AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SongsRoutingModule { }
