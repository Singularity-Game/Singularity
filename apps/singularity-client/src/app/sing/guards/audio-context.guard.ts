import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import * as Tone from 'tone';
import {
  AudioContextActivationDialogComponent
} from '../dialogs/audio-context-activation-dialog/audio-context-activation-dialog.component';
import { ModalService } from '@singularity/ui';

@Injectable()
export class AudioContextGuard implements CanActivate {

  constructor(private readonly modalService: ModalService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (Tone.context.state === 'running') {
      return true;
    }

    return this.modalService.open$<boolean>(AudioContextActivationDialogComponent)
      .pipe(
        map((value) => !!value)
      );
  }

}
