import { Inject, Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import * as Tone from 'tone';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';
import {
  AudioContextActivationDialogComponent
} from '../dialogs/audio-context-activation-dialog/audio-context-activation-dialog.component';

@Injectable()
export class AudioContextGuard implements CanActivate {

  constructor(@Inject(TuiDialogService) private readonly tuiDialogService: TuiDialogService,
              private readonly injector: Injector) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (Tone.context.state === 'running') {
      return true;
    }

    return this.tuiDialogService.open<boolean>(new PolymorpheusComponent(AudioContextActivationDialogComponent, this.injector), {
      closeable: false,
      dismissible: false
    });

  }

}
