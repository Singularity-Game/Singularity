import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyRoutingModule } from './party-routing.module';
import { CreatePartyComponent } from './create-party/create-party.component';
import { TuiInputModule, TuiIslandModule } from '@taiga-ui/kit';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule } from '@taiga-ui/core';



@NgModule({
  declarations: [
    CreatePartyComponent
  ],
  imports: [
    CommonModule,
    PartyRoutingModule,
    TuiIslandModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiButtonModule
  ]
})
export class PartyModule { }
