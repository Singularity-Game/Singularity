import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySmartphoneNavbarComponent } from './party-smartphone-navbar.component';

describe('PartySongSelectNavbarComponent', () => {
  let component: PartySmartphoneNavbarComponent;
  let fixture: ComponentFixture<PartySmartphoneNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartySmartphoneNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartySmartphoneNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
