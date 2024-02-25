import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSongUplodadTxtFileComponentComponent } from './create-song-uplodad-txt-file-component.component';

describe('CreateSongUplodadTxtFileComponentComponent', () => {
  let component: CreateSongUplodadTxtFileComponentComponent;
  let fixture: ComponentFixture<CreateSongUplodadTxtFileComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSongUplodadTxtFileComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSongUplodadTxtFileComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
