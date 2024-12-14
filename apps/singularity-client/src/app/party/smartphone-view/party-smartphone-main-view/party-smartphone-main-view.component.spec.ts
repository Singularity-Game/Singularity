import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySmartphoneMainViewComponent } from './party-smartphone-main-view.component';

describe('PartySmartphoneMainViewComponent', () => {
  let component: PartySmartphoneMainViewComponent;
  let fixture: ComponentFixture<PartySmartphoneMainViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartySmartphoneMainViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartySmartphoneMainViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
