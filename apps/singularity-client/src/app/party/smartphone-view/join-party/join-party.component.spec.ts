import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinPartyComponent } from './join-party.component';

describe('JoinPartyComponent', () => {
  let component: JoinPartyComponent;
  let fixture: ComponentFixture<JoinPartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JoinPartyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JoinPartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
