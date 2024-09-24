import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputContainerComponent } from './input-container.component';

describe('InputComponent', () => {
  let component: InputContainerComponent;
  let fixture: ComponentFixture<InputContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
