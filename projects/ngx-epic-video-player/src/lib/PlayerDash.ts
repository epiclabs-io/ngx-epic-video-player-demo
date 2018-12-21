import { BitrateInfo, MediaPlayer, MediaPlayerClass } from 'dashjs';
import { IRendition, Player, PlayerType } from './Player';

export class PlayerDash extends Player<MediaPlayerClass> {
  constructor(url: string, htmlPlayer: HTMLVideoElement) {
    super(url, htmlPlayer);
  }

  load(): void {
    this.reset();
    try {
      this.player = MediaPlayer().create();
      this.player.getDebug().setLogToBrowserConsole(false);
      this.player.initialize(this.htmlPlayer, this.url, false);

      this.initListeners();

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

  getRenditions(): IRendition[] {
    // (window as any).player = this.player; // only for debug
    return this.convertBitratesToIRenditions(this.player.getBitrateInfoListFor('video'));
  }

  setRendition(rendition: IRendition | number): void {
    if (typeof rendition === 'number') {
      if (rendition === -1) {
        this.player.setAutoSwitchQualityFor('video', true);
      } else {
        this.player.setAutoSwitchQualityFor('video', false);
        this.player.setQualityFor('video', rendition);
      }
      return;
    } else {
      const renditions = this.getRenditions();
      if (renditions !== undefined && renditions.length > 0) {
        for (let i = 0; i < renditions.length; i++) {
          if (renditions[i].bitrate === rendition.bitrate) {
            this.player.setAutoSwitchQualityFor('video', false);
            this.player.setQualityFor('video', i);
            return;
          }
        }
      }
    }
    return;
  }

  getCurrentRendition(): IRendition {
    const renditions = this.getRenditions();
    if (renditions !== undefined && renditions.length > 0) {
      const currentQuality = this.player.getQualityFor('video');
      if (currentQuality >= 0) {
        return renditions[currentQuality];
      }
    }
    return;
  }

  private convertBitratesToIRenditions(bitrates: BitrateInfo[]): IRendition[] {
    if (bitrates === undefined || bitrates.length === 0) { return; }
    return bitrates.map((b: BitrateInfo) => {
      return {
        bitrate: b.bitrate !== undefined ? b.bitrate : undefined,
        height: b.height !== undefined ? b.height : undefined,
        level: b.qualityIndex !== undefined ? b.qualityIndex : undefined,
        width: b.width !== undefined ? b.width : undefined,
      };
    });
  }
}
