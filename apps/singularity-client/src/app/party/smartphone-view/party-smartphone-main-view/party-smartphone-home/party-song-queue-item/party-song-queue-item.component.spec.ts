import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySongQueueItemComponent } from './party-song-queue-item.component';

describe('PartySongQueueItemComponent', () => {
  let component: PartySongQueueItemComponent;
  let fixture: ComponentFixture<PartySongQueueItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartySongQueueItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartySongQueueItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
