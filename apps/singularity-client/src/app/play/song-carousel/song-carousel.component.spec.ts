import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongCarouselComponent } from './song-carousel.component';

describe('SongCarouselComponent', () => {
  let component: SongCarouselComponent;
  let fixture: ComponentFixture<SongCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SongCarouselComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SongCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
