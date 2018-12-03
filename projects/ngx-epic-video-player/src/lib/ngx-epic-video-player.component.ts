import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MediaPlayer, MediaPlayerClass } from 'dashjs';
import * as Hls from 'hls.js';


@Component({
  selector: 'vp-ngx-epic-video-player',
  templateUrl: './ngx-epic-video-player.component.html',
  styleUrls: ['./ngx-epic-video-player.component.scss']
})
export class NgxEpicVideoPlayerComponent implements OnInit {

  @ViewChild('player') playerDomElement: ElementRef;

  player: MediaPlayerClass | Hls;

  url: string;
  @Input('url')
  set setUrl(value: string) {
    if (this.url !== value) {
      this.url = value;
      this.loadVideo();
    }
  }

  constructor() { }

  ngOnInit() { }

  loadVideo() {
    try {
      const filename = this.url.substr(this.url.lastIndexOf('/') + 1);
      const extension = filename.split('.').pop();
      if (extension === 'm3u8') {
        this.loadHlsVideo();
      } else {
        this.loadDashVideo();
      }
    } catch (e) {
      console.error(e);
    }
  }

  private loadDashVideo() {
    this.player = MediaPlayer().create();
    this.player.getDebug().setLogToBrowserConsole(false);
    this.player.initialize(this.playerDomElement.nativeElement, this.url, true);
  }

  private loadHlsVideo() {
    if (Hls.isSupported()) {
      this.player = new Hls();
      this.player.loadSource(this.url);
      this.player.attachMedia(this.playerDomElement.nativeElement);
      this.player.on(Hls.Events.MANIFEST_PARSED, () => this.playerDomElement.nativeElement.play());
    } else if (this.playerDomElement.nativeElement.canPlayType('application/vnd.apple.mpegurl')) {
      this.playerDomElement.nativeElement.src = 'this.url';
      this.playerDomElement.nativeElement.addEventListener('loadedmetadata', () => this.playerDomElement.nativeElement.play());
    }
  }

}
