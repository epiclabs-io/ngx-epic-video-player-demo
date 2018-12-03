import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styles: []
})
export class AppComponent {
  title = 'ngx-epic-video-player-demo';
  videoUrl = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';

  loadUrl(type: 'dash' | 'hls') {
    if (type === 'dash') {
      this.videoUrl = 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd';
    } else {
      this.videoUrl = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
    }
  }
}
