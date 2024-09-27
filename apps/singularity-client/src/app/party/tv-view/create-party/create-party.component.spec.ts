import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePartyComponent } from './create-party.component';

describe('CreatePartyComponent', () => {
  let component: CreatePartyComponent;
  let fixture: ComponentFixture<CreatePartyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePartyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePartyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
