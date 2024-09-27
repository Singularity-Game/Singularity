import { NgModule } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { NoCommaPipe } from './pipes/no-comma/no-comma.pipe';
import { RouterLink } from '@angular/router';
import { SearchPipe } from './pipes/search/search.pipe';
import { OrderByPipe } from './pipes/order-by/order-by.pipe';
import { AdminFeatureIconComponent } from './components/admin-feature-icon/admin-feature-icon.component';
import { TranslocoModule } from '@ngneat/transloco';
import { SingularityUiModule } from '@singularity/ui';
import { SafePipe } from './pipes/safe/safe.pipe';
import { PromptDialogComponent } from './components/prompt-dialog/prompt-dialog.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';

@NgModule({
  declarations: [NavbarComponent, SidebarComponent, NoCommaPipe, SearchPipe, OrderByPipe, AdminFeatureIconComponent, SafePipe, PromptDialogComponent, AudioPlayerComponent],
  imports: [CommonModule, RouterLink, TranslocoModule, SingularityUiModule],
  providers: [],
  exports: [NavbarComponent, SidebarComponent, AdminFeatureIconComponent, NoCommaPipe, SearchPipe, OrderByPipe, SafePipe, AudioPlayerComponent]
})
export class SharedModule {}
