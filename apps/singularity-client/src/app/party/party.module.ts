import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyRoutingModule } from './party-routing.module';
import { CreatePartyComponent } from './create-party/create-party.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CreatePartyComponent
  ],
  imports: [
    CommonModule,
    PartyRoutingModule,
    ReactiveFormsModule,
  ]
})
export class PartyModule { }
