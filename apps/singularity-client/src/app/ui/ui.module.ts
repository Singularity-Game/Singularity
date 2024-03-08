import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { UiRoutingModule } from "./ui-routing.module";
import { UiComponent } from "./ui/ui.component";
import { SingularityUiModule } from '@singularity/ui';

@NgModule({
  declarations: [UiComponent],
  imports: [CommonModule, UiRoutingModule, SingularityUiModule]
})
export class UiModule {}
