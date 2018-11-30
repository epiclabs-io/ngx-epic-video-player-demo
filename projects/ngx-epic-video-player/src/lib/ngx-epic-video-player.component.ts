import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {MediaPlayer, MediaPlayerClass} from 'dashjs';

@Component({
  selector: 'vp-ngx-epic-video-player',
  templateUrl: './ngx-epic-video-player.component.html',
  styleUrls: ['./ngx-epic-video-player.component.scss']
})
export class NgxEpicVideoPlayerComponent implements OnInit {

  player: MediaPlayerClass;
  @ViewChild('player') playerDomElement: ElementRef;

  url: string;
  @Input('url')
  set setUrl(value: string) {
    this.url = value;
    this.loadVideo();
  }

  constructor() { }

  ngOnInit() {
  }

  loadVideo() {
    if (!!this.url) {
      this.player = MediaPlayer().create();
      this.player.initialize(this.playerDomElement.nativeElement, this.url, true);
    }
  }

}
