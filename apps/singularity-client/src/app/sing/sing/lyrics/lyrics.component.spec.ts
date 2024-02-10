import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LyricsComponent } from './lyrics.component';

describe('SingComponent', () => {
  let component: LyricsComponent;
  let fixture: ComponentFixture<LyricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LyricsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LyricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
