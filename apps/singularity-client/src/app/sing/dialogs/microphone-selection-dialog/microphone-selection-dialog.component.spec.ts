import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrophoneSelectionDialogComponent } from './microphone-selection-dialog.component';

describe('MicrophoneSelectionDialogComponent', () => {
  let component: MicrophoneSelectionDialogComponent;
  let fixture: ComponentFixture<MicrophoneSelectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MicrophoneSelectionDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MicrophoneSelectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
