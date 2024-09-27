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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgressDirective } from './progress/progress.directive';
import { TooltipComponent } from './tooltip/tooltip.component';
import { TooltipDirective } from './tooltip/tooltip.directive';
import { LoaderComponent } from './loader/loader.component';
import { FilesComponent } from './files/files.component';
import { InputFileComponent } from './input-file/input-file.component';
import { ModalComponent } from './modal/modal.component';
import { CheckboxDirective } from './checkbox/checkbox.directive';
import { AlertComponent } from './alert/alert.component';
import { ToastComponent } from './toast/toast.component';
import { MouseTimeoutComponent } from './mouse-timeout/mouse-timeout.component';

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
    TooltipComponent,
    TooltipDirective,
    LoaderComponent,
    FilesComponent,
    InputFileComponent,
    ModalComponent,
    CheckboxDirective,
    AlertComponent,
    ToastComponent,
    MouseTimeoutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
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
    InputNumberComponent,
    TooltipDirective,
    LoaderComponent,
    FilesComponent,
    InputFileComponent,
    CheckboxDirective,
    AlertComponent,
    MouseTimeoutComponent
  ]
})
export class SingularityUiModule { }
