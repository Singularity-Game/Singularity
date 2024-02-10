import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementRoutingModule } from './management-routing.module';
import { ManagementComponent } from './management.component';
import { SharedModule } from '../shared/shared.module';
import { TuiButtonModule, TuiHintModule, TuiSvgModule } from '@taiga-ui/core';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [ManagementComponent],
  imports: [CommonModule, ManagementRoutingModule, SharedModule, TuiButtonModule, TuiSvgModule, TuiHintModule, TranslocoModule]
})
export class ManagementModule {}
