import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePartyComponent } from './create-party/create-party.component';

const routes: Routes = [
  { path: '', component: CreatePartyComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyRoutingModule {
}
