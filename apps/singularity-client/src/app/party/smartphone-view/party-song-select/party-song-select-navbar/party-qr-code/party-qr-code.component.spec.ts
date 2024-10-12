import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyQrCodeComponent } from './party-qr-code.component';

describe('PartyQrCodeComponent', () => {
  let component: PartyQrCodeComponent;
  let fixture: ComponentFixture<PartyQrCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartyQrCodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartyQrCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
