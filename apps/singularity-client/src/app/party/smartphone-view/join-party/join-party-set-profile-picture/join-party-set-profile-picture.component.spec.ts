import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinPartySetProfilePictureComponent } from './join-party-set-profile-picture.component';

describe('JoinPartySetProfilePictureComponent', () => {
  let component: JoinPartySetProfilePictureComponent;
  let fixture: ComponentFixture<JoinPartySetProfilePictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JoinPartySetProfilePictureComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JoinPartySetProfilePictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
