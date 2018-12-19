import { MediaPlayer, MediaPlayerClass } from 'dashjs';
import { Player, PlayerType } from './Player';

export class PlayerDash extends Player<MediaPlayerClass> {
  constructor(url: string, htmlPlayer: HTMLVideoElement) {
    super(url, htmlPlayer);
  }

  load(): void {
    try {
      this.player = MediaPlayer().create();
      this.player.getDebug().setLogToBrowserConsole(false);
      this.player.initialize(this.htmlPlayer, this.url, false);
      this.playerType = PlayerType.DASH;
    } catch (e) {
      console.error(e);
    }
  }

  destroy(): void {
    try {
      this.player.reset();
      this.playerType = undefined;
    } catch (e) {
      console.error(e);
    }
  }
}
