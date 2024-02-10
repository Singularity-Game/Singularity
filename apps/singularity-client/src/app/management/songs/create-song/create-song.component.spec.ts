import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSongComponent } from './create-song.component';

describe('CreateSongComponent', () => {
  let component: CreateSongComponent;
  let fixture: ComponentFixture<CreateSongComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateSongComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
