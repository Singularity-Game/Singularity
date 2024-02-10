import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingScoreDialogComponent } from './sing-score-dialog.component';

describe('SingScoreDialogComponent', () => {
  let component: SingScoreDialogComponent;
  let fixture: ComponentFixture<SingScoreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingScoreDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingScoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
