import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingPageComponent } from './sing-page.component';

describe('SingComponent', () => {
  let component: SingPageComponent;
  let fixture: ComponentFixture<SingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SingPageComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
