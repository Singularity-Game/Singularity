import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouseTimeoutComponent } from './mouse-timeout.component';

describe('MouseTimeoutComponent', () => {
  let component: MouseTimeoutComponent;
  let fixture: ComponentFixture<MouseTimeoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MouseTimeoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MouseTimeoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
