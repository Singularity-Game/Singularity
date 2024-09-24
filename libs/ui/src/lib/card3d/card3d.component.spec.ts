import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Card3dComponent } from './card3d.component';

describe('Card3dComponent', () => {
  let component: Card3dComponent;
  let fixture: ComponentFixture<Card3dComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Card3dComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Card3dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
