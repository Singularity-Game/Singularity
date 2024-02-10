import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SongGridItemComponent } from './song-grid-item.component';

describe('SongGridItemComponent', () => {
  let component: SongGridItemComponent;
  let fixture: ComponentFixture<SongGridItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SongGridItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SongGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
