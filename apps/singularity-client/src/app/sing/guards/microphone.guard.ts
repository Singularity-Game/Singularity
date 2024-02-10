import { Inject, Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TuiDialogService } from '@taiga-ui/core';
import { MicrophoneService } from '../services/microphone.service';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import {
  MicrophoneSelectionDialogComponent
} from '../dialogs/microphone-selection-dialog/microphone-selection-dialog.component';

@Injectable()
export class MicrophoneGuard implements CanActivate {
  constructor(@Inject(TuiDialogService) private readonly tuiDialogService: TuiDialogService,
              private readonly microphoneService: MicrophoneService,
              private readonly injector: Injector) {
  }
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const microphonesSelected = this.microphoneService.isAnyMicrophoneSelected();

      if (microphonesSelected) {
        return true
      }

      return this.tuiDialogService.open<boolean>(new PolymorpheusComponent(MicrophoneSelectionDialogComponent, this.injector), {
        closeable: false,
        dismissible: false
      });
  }

}
