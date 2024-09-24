import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastImageComponent } from './fast-image.component';

describe('FastImageComponent', () => {
  let component: FastImageComponent;
  let fixture: ComponentFixture<FastImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FastImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FastImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
