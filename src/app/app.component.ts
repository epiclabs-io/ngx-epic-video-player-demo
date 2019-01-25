import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgxEpicVideoPlayerComponent } from '../../projects/ngx-epic-video-player/src/lib/ngx-epic-video-player.component';
import { IRendition, IStats } from 'projects/ngx-epic-video-player/src/lib/Player';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild('log') log: ElementRef;
  @ViewChild('evp') evp: NgxEpicVideoPlayerComponent;

  videoUrl = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';
  autoplay = false;
  controls = true;
  muted = true;
  loop = false;

  stats: IStats;
  renditions: IRendition[];
  currentRendition: IRendition;
  desiredRendition = -1;
  autoRendition = -1;

  pauseVideo(): void {
    this.evp.pause();
  }

  playVideo(): void {
    this.evp.play();
  }

  onVideoUrlChange(newValue: string): void {
    this.desiredRendition = this.autoRendition;
    this.videoUrl = newValue;
  }

  onEvent(e: any): void {
    this.writeLog(JSON.stringify(e));

    switch (e.type) {
      case 'timeupdate':
        this.stats = this.evp.getStats();
        this.currentRendition = this.evp.getCurrentRendition();
        return;
      case 'canplay':
        this.renditions = this.evp.getRenditions();
        return;
      default:
    }
  }

  onSelectedRenditionChange(): void {
    if (this.desiredRendition !== undefined) {
      this.evp.setRendition(this.renditions[this.desiredRendition], true);
    }
  }

  loadExample(type: string): void {
    this.desiredRendition = this.autoRendition;
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
