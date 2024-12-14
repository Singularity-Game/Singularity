import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySmartphoneHeaderComponent } from './party-smartphone-header.component';

describe('PartySongSelectHeaderComponent', () => {
  let component: PartySmartphoneHeaderComponent;
  let fixture: ComponentFixture<PartySmartphoneHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartySmartphoneHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartySmartphoneHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
