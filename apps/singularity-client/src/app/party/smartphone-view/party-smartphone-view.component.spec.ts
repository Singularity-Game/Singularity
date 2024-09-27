import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySmartphoneViewComponent } from './party-smartphone-view.component';

describe('PartySmartphoneViewComponent', () => {
  let component: PartySmartphoneViewComponent;
  let fixture: ComponentFixture<PartySmartphoneViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartySmartphoneViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartySmartphoneViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
