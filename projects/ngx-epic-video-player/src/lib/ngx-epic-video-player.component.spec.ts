import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxEpicVideoPlayerComponent } from './ngx-epic-video-player.component';

describe('NgxEpicVideoPlayerComponent', () => {
  let component: NgxEpicVideoPlayerComponent;
  let fixture: ComponentFixture<NgxEpicVideoPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxEpicVideoPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxEpicVideoPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
