import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySongSelectHeaderComponent } from './party-song-select-header.component';

describe('PartySongSelectHeaderComponent', () => {
  let component: PartySongSelectHeaderComponent;
  let fixture: ComponentFixture<PartySongSelectHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartySongSelectHeaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartySongSelectHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
