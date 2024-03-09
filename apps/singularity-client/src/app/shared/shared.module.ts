import { NgModule } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { NoCommaPipe } from './pipes/no-comma/no-comma.pipe';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHintModule,
  TuiHostedDropdownModule,
  TuiSvgModule
} from '@taiga-ui/core';
import { RouterLink } from '@angular/router';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { SearchPipe } from './pipes/search/search.pipe';
import { OrderByPipe } from './pipes/order-by/order-by.pipe';
import { AdminFeatureIconComponent } from './components/admin-feature-icon/admin-feature-icon.component';
import { TranslocoModule } from '@ngneat/transloco';
import { SingularityUiModule } from '@singularity/ui';

@NgModule({
  declarations: [NavbarComponent, SidebarComponent, NoCommaPipe, SearchPipe, OrderByPipe, AdminFeatureIconComponent],
  imports: [CommonModule, TuiButtonModule, RouterLink, TuiHostedDropdownModule, TuiAvatarModule, TuiDataListModule, TuiSvgModule, TuiHintModule, TranslocoModule, SingularityUiModule],
  providers: [],
  exports: [NavbarComponent, SidebarComponent, AdminFeatureIconComponent, NoCommaPipe, SearchPipe, OrderByPipe],
})
export class SharedModule {}
