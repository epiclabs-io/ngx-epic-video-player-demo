import { IRendition, Player, PlayerType } from './Player';
import * as Hls from 'hls.js';

export class PlayerHls extends Player<Hls> {
  constructor(url: string, htmlPlayer: HTMLVideoElement) {
    super(url, htmlPlayer);
  }

  load(): void {
    this.reset();
    try {
      if (Hls.isSupported()) {
        this.player = new Hls();
        this.player.loadSource(this.url);
        this.player.attachMedia(this.htmlPlayer);
      } else if (this.htmlPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        this.htmlPlayer.src = this.url;
      }
      this.initListeners();
      this.playerType = PlayerType.HLS;
    } catch (e) {
      console.error(e);
    }
  }

  destroy(): void {
    try {
      this.player.destroy();
    } catch (e) {
      console.warn(e);
    } finally {
      this.playerType = undefined;
    }
  }

  getRenditions(): IRendition[] {
    // (window as any).player = this.player; // only for debug
    return this.convertLevelsToIRenditions(this.player.levels as any);
  }

  setRendition(rendition: IRendition | number): void {
    if (typeof rendition === 'number') {
      this.player.loadLevel = rendition;
      return;
    } else {
      const renditions = this.getRenditions();
      if (renditions !== undefined && renditions.length > 0) {
        for (let i = 0; i < renditions.length; i++) {
          if (renditions[i].bitrate === rendition.bitrate) {
            this.player.loadLevel = i;
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
      const currentLevel = this.player.currentLevel;
      if (currentLevel >= 0) {
        return renditions[currentLevel];
      }
    }
    return;
  }

  private convertLevelsToIRenditions(levels: Hls.levelSwitchingData[]): IRendition[] {
    if (levels === undefined || levels.length === 0) { return; }
    return levels.map((l: Hls.levelSwitchingData) => {
      return {
        audioCodec: l.audioCodec !== undefined ? l.audioCodec : undefined,
        bitrate: l.bitrate !== undefined ? l.bitrate : undefined,
        height: l.height !== undefined ? l.height : undefined,
        level: l.level !== undefined ? l.level : undefined,
        name: l.name !== undefined ? l.name : undefined,
        videoCodec: l.videoCodec !== undefined ? l.videoCodec : undefined,
        width: l.width !== undefined ? l.width : undefined,
      };
    });
  }
}
