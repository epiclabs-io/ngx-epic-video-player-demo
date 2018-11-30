import { TestBed } from '@angular/core/testing';

import { NgxEpicVideoPlayerService } from './ngx-epic-video-player.service';

describe('NgxEpicVideoPlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxEpicVideoPlayerService = TestBed.get(NgxEpicVideoPlayerService);
    expect(service).toBeTruthy();
  });
});
