import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinPartySetUsernameComponent } from './join-party-set-username.component';

describe('JoinPartySetUsernameComponent', () => {
  let component: JoinPartySetUsernameComponent;
  let fixture: ComponentFixture<JoinPartySetUsernameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JoinPartySetUsernameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JoinPartySetUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
