import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlurryBackgroundBlobComponent } from './blurry-background-blob.component';

describe('BlurryBackgroundBlobComponent', () => {
  let component: BlurryBackgroundBlobComponent;
  let fixture: ComponentFixture<BlurryBackgroundBlobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlurryBackgroundBlobComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlurryBackgroundBlobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
