import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementRoutingModule } from './management-routing.module';
import { ManagementComponent } from './management.component';
import { SharedModule } from '../shared/shared.module';
import { TranslocoModule } from '@ngneat/transloco';
import { SingularityUiModule } from '@singularity/ui';

@NgModule({
  declarations: [ManagementComponent],
  imports: [CommonModule, ManagementRoutingModule, SharedModule, TranslocoModule, SingularityUiModule]
})
export class ManagementModule {}
