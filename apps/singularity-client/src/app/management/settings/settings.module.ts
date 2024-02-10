import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';
import {
  TuiInputCountModule,
  TuiIslandModule,
  TuiProgressModule,
  TuiRadioBlockModule,
  TuiSelectModule
} from '@taiga-ui/kit';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiGroupModule,
  TuiLabelModule,
  TuiTextfieldControllerModule
} from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [SettingsComponent],
  imports: [CommonModule, SettingsRoutingModule, TuiIslandModule, TuiButtonModule, TuiInputCountModule, TuiLabelModule, FormsModule, TuiSelectModule, TuiTextfieldControllerModule, TuiDataListModule, TuiGroupModule, TuiRadioBlockModule, TuiProgressModule, TranslocoModule],
  providers: [],
})
export class SettingsModule {}
