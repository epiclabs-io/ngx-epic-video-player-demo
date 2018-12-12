import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxEpicVideoPlayerComponent } from '../../projects/ngx-epic-video-player/src/lib/ngx-epic-video-player.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild('log') log: ElementRef;
  @ViewChild('player') player: NgxEpicVideoPlayerComponent;

  videoUrl = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';

  loadUrl(videoUrl: string): void {
    this.videoUrl = videoUrl;
  }

  pauseVideo(): void {
    this.player.pause();
  }

  playVideo(): void {
    this.player.play();
  }

  onEvent(e: any): void {
    this.writeLog(JSON.stringify(e));
  }

  loadExample(type: string): void {
    switch (type) {
      case 'dash':
        this.videoUrl = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';
        break;
      case 'hls':
        this.videoUrl = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
        break;
      default:
    }
  }

  writeLog(log?: string): void {
    if (log === undefined) {
      (this.log.nativeElement as HTMLParagraphElement).innerHTML = '';
    } else {
      const logContent = (this.log.nativeElement as HTMLParagraphElement).innerHTML;
      (this.log.nativeElement as HTMLParagraphElement).innerHTML = log + '<br>' + logContent;
    }
  }
}
