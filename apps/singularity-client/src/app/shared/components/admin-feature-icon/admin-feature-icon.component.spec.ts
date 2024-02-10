import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFeatureIconComponent } from './admin-feature-icon.component';

describe('AdminFeatureIconComponent', () => {
  let component: AdminFeatureIconComponent;
  let fixture: ComponentFixture<AdminFeatureIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminFeatureIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminFeatureIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
