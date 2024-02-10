import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocalGridComponent } from './vocal-grid.component';

describe('VocalGridComponent', () => {
  let component: VocalGridComponent;
  let fixture: ComponentFixture<VocalGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VocalGridComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VocalGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
