import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card3dComponent } from './card3d/card3d.component';
import { LogoComponent } from './logo/logo.component';
import { LayoutComponent } from './layout/layout.component';
import { FastImageComponent } from './fast-image/fast-image.component';
import { ButtonComponent } from './button/button.component';
import { InputContainerComponent } from './input/input-container.component';
import { InputDirective } from './input/input.directive';
import { SelectComponent } from './select/select.component';
import { SelectOptionComponent } from './select/select-option.component';
import { BackgroundComponent } from './background/background.component';
import { BlurryBackgroundBlobComponent } from './blurry-background-blob/blurry-background-blob.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { SliderDirective } from './slider/slider.directive';
import { InputNumberComponent } from './input-number/input-number.component';
import { FormsModule } from '@angular/forms';
import { ProgressDirective } from './progress/progress.directive';

@NgModule({
  declarations: [
    Card3dComponent,
    LogoComponent,
    LayoutComponent,
    FastImageComponent,
    ButtonComponent,
    InputContainerComponent,
    InputDirective,
    SelectComponent,
    SelectOptionComponent,
    BackgroundComponent,
    BlurryBackgroundBlobComponent,
    DropdownComponent,
    SliderDirective,
    InputNumberComponent,
    ProgressDirective,
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    Card3dComponent,
    LogoComponent,
    LayoutComponent,
    FastImageComponent,
    ButtonComponent,
    InputContainerComponent,
    InputDirective,
    SelectComponent,
    SelectOptionComponent,
    BackgroundComponent,
    BlurryBackgroundBlobComponent,
    DropdownComponent,
    SliderDirective,
    ProgressDirective,
    InputNumberComponent
  ]
})
export class SingularityUiModule { }
