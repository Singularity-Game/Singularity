import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySongSelectNavbarComponent } from './party-song-select-navbar.component';

describe('PartySongSelectNavbarComponent', () => {
  let component: PartySongSelectNavbarComponent;
  let fixture: ComponentFixture<PartySongSelectNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartySongSelectNavbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartySongSelectNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
