import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card3dComponent } from './card3d/card3d.component';
import { SuiGlobalColorService } from './sui-global-color/sui-global-color.service';
import { LogoComponent } from './logo/logo.component';
import { LayoutComponent } from './layout/layout.component';

@NgModule({
  declarations: [
    Card3dComponent,
    LogoComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    Card3dComponent,
    LogoComponent,
    LayoutComponent
  ]
})
export class SingularityUiModule { }
