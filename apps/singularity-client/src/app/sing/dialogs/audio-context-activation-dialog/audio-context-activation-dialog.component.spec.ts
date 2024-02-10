import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioContextActivationDialogComponent } from './audio-context-activation-dialog.component';

describe('MicrophoneSelectionDialogComponent', () => {
  let component: AudioContextActivationDialogComponent;
  let fixture: ComponentFixture<AudioContextActivationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioContextActivationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioContextActivationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
