import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card3dComponent } from './card3d/card3d.component';
import { LogoComponent } from './logo/logo.component';
import { LayoutComponent } from './layout/layout.component';
import { FastImageComponent } from './fast-image/fast-image.component';
import { ButtonComponent } from './button/button.component';
import { InputContainerComponent } from './input/input-container.component';
import { InputDirective } from './input/input.directive';

@NgModule({
  declarations: [
    Card3dComponent,
    LogoComponent,
    LayoutComponent,
    FastImageComponent,
    ButtonComponent,
    InputContainerComponent,
    InputDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    Card3dComponent,
    LogoComponent,
    LayoutComponent,
    FastImageComponent,
    ButtonComponent,
    InputContainerComponent,
    InputDirective
  ]
})
export class SingularityUiModule { }
