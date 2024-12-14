import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingPageComponent } from './sing-page.component';
import { MicrophoneGuard } from './guards/microphone.guard';
import { AudioContextGuard } from './guards/audio-context.guard';

const routes: Routes = [
  { path: ':id', component: SingPageComponent, canActivate: [MicrophoneGuard(), AudioContextGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SingPageRoutingModule {
}
