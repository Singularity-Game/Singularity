import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAccountInfoDialogComponent } from './no-account-info-dialog.component';

describe('NoAccountInfoDialogComponent', () => {
  let component: NoAccountInfoDialogComponent;
  let fixture: ComponentFixture<NoAccountInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoAccountInfoDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoAccountInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
