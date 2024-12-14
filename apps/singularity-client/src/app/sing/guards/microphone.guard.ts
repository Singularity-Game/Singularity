import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { MicrophoneService } from '../services/microphone.service';
import {
  MicrophoneSelectionDialogComponent
} from '../dialogs/microphone-selection-dialog/microphone-selection-dialog.component';
import { ModalService } from '@singularity/ui';

export function MicrophoneGuard(maxCount = 10, minCount = 1): CanActivateFn {
  return () => {
    const microphoneService = inject(MicrophoneService);
    const modalService = inject(ModalService);

    const selectedMicrophoneCount = microphoneService.getSelectedMicrophones().length;

    const microphonesSelected = selectedMicrophoneCount >= minCount && selectedMicrophoneCount <= maxCount;

    if (microphonesSelected) {
      return true
    }

    return modalService.open$<boolean, {minCount: number, maxCount: number}>(MicrophoneSelectionDialogComponent, {minCount, maxCount})
      .pipe(
        map((value) => !!value)
      );
  }
}
