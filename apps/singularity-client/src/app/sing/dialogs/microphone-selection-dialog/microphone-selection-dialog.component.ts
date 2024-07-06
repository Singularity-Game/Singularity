import { Component, OnDestroy, OnInit } from '@angular/core';
import { MicrophoneService } from '../../services/microphone.service';
import { finalize, map, Observable, Subject, takeUntil, tap } from 'rxjs';
import { FormArray, FormControl } from '@angular/forms';
import { MicrophoneWithMeter } from './microphone-with-meter';
import { Nullable } from '@singularity/api-interfaces';
import { ModalContext } from '@singularity/ui';

@Component({
  selector: 'singularity-microphone-selection-dialog',
  templateUrl: './microphone-selection-dialog.component.html',
  styleUrls: ['./microphone-selection-dialog.component.scss'],
})
export class MicrophoneSelectionDialogComponent implements OnInit, OnDestroy {
  public formArray = new FormArray<FormControl<Nullable<MicrophoneWithMeter>>>([
    new FormControl<Nullable<MicrophoneWithMeter>>(null)
  ]);
  public devices$?: Observable<Nullable<MicrophoneWithMeter>[]>;

  public destroySubject = new Subject<void>();

  constructor(private readonly modalContext: ModalContext<boolean, null>,
              private readonly microphoneService: MicrophoneService) {
  }

  public ngOnInit(): void {
    this.setupDevicesObservale();
    this.setupFormArray();
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public submit(): void {
    const microphonesDeviceIds = this.formArray.value
      .filter((value: Nullable<MicrophoneWithMeter>) => value !== null)
      .map((value: Nullable<MicrophoneWithMeter>) => (value as MicrophoneWithMeter).device.deviceId);

    this.microphoneService.setMicrophones(microphonesDeviceIds);

    this.modalContext.close(true);
  }

  public abort(): void {
    this.modalContext.close(false);
  }

  private setupDevicesObservale(): void {
    this.devices$ = this.microphoneService.getDevices$()
      .pipe(
        map((devices: MediaDeviceInfo[]) => {
          const array = devices.map<Nullable<MicrophoneWithMeter>>((device: MediaDeviceInfo) => ({
            device: device,
            meter$: this.microphoneService.getDeviceMeter$(device.deviceId).pipe(
              tap(() => console.log('start')),
              finalize(() => console.log('strop'))
            )
          }));
          array.unshift(null);
          return array;
        })
      );
  }

  private setupFormArray(): void {
    this.formArray.valueChanges
      .pipe(takeUntil(this.destroySubject))
      .subscribe((selectedMicrophones: Nullable<MicrophoneWithMeter>[]) => {
        const lastControl = selectedMicrophones[selectedMicrophones.length - 1];
        if (lastControl !== null) {
          this.formArray.insert(this.formArray.length, new FormControl<Nullable<MicrophoneWithMeter>>(null), {emitEvent: false});
        } else if (selectedMicrophones.length > 1) {
          this.formArray.controls.forEach((control: FormControl<Nullable<MicrophoneWithMeter>>, index: number) => {
            if (control.value === null && index !== this.formArray.length - 1) {
              this.formArray.removeAt(index, {emitEvent: false})
            }
          });
        }
      });
  }
}
