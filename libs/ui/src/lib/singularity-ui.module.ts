import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card3dComponent } from './card3d/card3d.component';
import { LogoComponent } from './logo/logo.component';
import { LayoutComponent } from './layout/layout.component';
import { FastImageComponent } from './fast-image/fast-image.component';

@NgModule({
  declarations: [
    Card3dComponent,
    LogoComponent,
    LayoutComponent,
    FastImageComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    Card3dComponent,
    LogoComponent,
    LayoutComponent,
    FastImageComponent
  ]
})
export class SingularityUiModule { }
