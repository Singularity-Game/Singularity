import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartySingComponent } from './party-sing.component';

describe('PartySingComponent', () => {
  let component: PartySingComponent;
  let fixture: ComponentFixture<PartySingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartySingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PartySingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
