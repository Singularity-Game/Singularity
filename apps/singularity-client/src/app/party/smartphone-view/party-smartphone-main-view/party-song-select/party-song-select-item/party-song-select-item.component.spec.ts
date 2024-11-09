import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySongSelectItemComponent } from './party-song-select-item.component';

describe('PartySongSelectItemComponent', () => {
  let component: PartySongSelectItemComponent;
  let fixture: ComponentFixture<PartySongSelectItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartySongSelectItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartySongSelectItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
