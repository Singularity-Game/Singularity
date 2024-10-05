import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySongSelectComponent } from './party-song-select.component';

describe('PartySongSelectComponent', () => {
  let component: PartySongSelectComponent;
  let fixture: ComponentFixture<PartySongSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartySongSelectComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartySongSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
