import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinPartyReadyComponent } from './join-party-ready.component';

describe('JoinPartyReadyComponent', () => {
  let component: JoinPartyReadyComponent;
  let fixture: ComponentFixture<JoinPartyReadyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JoinPartyReadyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JoinPartyReadyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
