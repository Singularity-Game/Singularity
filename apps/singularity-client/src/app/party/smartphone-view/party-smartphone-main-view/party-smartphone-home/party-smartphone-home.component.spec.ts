import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySmartphoneHomeComponent } from './party-smartphone-home.component';

describe('PartySongSelectComponent', () => {
  let component: PartySmartphoneHomeComponent;
  let fixture: ComponentFixture<PartySmartphoneHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartySmartphoneHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartySmartphoneHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
