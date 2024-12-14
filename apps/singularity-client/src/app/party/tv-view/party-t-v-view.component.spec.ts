import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyTVViewComponent } from './party-t-v-view.component';

describe('PartyComponent', () => {
  let component: PartyTVViewComponent;
  let fixture: ComponentFixture<PartyTVViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartyTVViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartyTVViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
