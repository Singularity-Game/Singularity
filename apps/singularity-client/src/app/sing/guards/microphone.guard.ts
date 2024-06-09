import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { MicrophoneService } from '../services/microphone.service';
import {
  MicrophoneSelectionDialogComponent
} from '../dialogs/microphone-selection-dialog/microphone-selection-dialog.component';
import { ModalService } from '@singularity/ui';

@Injectable()
export class MicrophoneGuard implements CanActivate {
  constructor(private readonly modalService: ModalService,
              private readonly microphoneService: MicrophoneService) {
  }
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const microphonesSelected = this.microphoneService.isAnyMicrophoneSelected();

      if (microphonesSelected) {
        return true
      }

    return this.modalService.open$<boolean, null>(MicrophoneSelectionDialogComponent, null)
      .pipe(
        map((value) => !!value)
      );
  }

}
