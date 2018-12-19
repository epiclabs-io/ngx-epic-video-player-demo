import { Player, PlayerType } from './Player';
import * as Hls from 'hls.js';

export class PlayerHls extends Player<Hls> {
  constructor(url: string, htmlPlayer: HTMLVideoElement) {
    super(url, htmlPlayer);
  }

  load(): void {
    try {
      if (Hls.isSupported()) {
        this.player = new Hls();
        this.player.loadSource(this.url);
        this.player.attachMedia(this.htmlPlayer);
      } else if (this.htmlPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        this.htmlPlayer.src = 'this.url';
      }
      this.playerType = PlayerType.HLS;
    } catch (e) {
      console.error(e);
    }
  }

  destroy(): void {
    try {
      this.player.destroy();
      this.playerType = undefined;
    } catch (e) {
      console.error(e);
    }
  }
}
