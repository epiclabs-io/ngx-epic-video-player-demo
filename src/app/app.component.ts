import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxEpicVideoPlayerComponent } from '../../projects/ngx-epic-video-player/src/lib/ngx-epic-video-player.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styles: [],
})
export class AppComponent {
  videoUrl = undefined;

  @ViewChild('log') log: ElementRef;
  @ViewChild('player') player: NgxEpicVideoPlayerComponent;

  loadUrl(type: 'dash' | 'hls') {
    if (type === 'dash') {
      this.videoUrl = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';
      this.writeLog('--- Loading ' + this.videoUrl + ' (DASH)');
    } else {
      this.videoUrl = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
      this.writeLog('--- Loading ' + this.videoUrl + ' (HLS)');
    }
  }

  pauseVideo(): void {
    this.player.pause();
  }

  playVideo(): void {
    this.player.play();
  }

  clearLog(): void {
    (this.log.nativeElement as HTMLParagraphElement).innerHTML = '';
  }

  onEvent(e: any): void {
    this.writeLog(JSON.stringify(e));

    if (e === 'canplay') {
      this.player.play();
    }
  }

  private writeLog(log: string): void {
    const logContent = (this.log.nativeElement as HTMLParagraphElement).innerHTML;
    (this.log.nativeElement as HTMLParagraphElement).innerHTML = log + '<br>' + logContent;
  }
}
