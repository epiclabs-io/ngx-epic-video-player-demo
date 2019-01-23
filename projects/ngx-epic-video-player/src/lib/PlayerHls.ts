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
        this.player = undefined;
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
      this.htmlPlayer.src = '';
      this.player.destroy();
      this.player = undefined;
    } catch (e) {
      console.warn(e);
    } finally {
      this.playerType = undefined;
    }
  }

  getRenditions(): IRendition[] {
    // (window as any).player = this.player; // only for debug
    if (this.player !== undefined) {
      return this.convertLevelsToIRenditions(this.player.levels as any);
    }
    return;
  }

  setRendition(rendition: IRendition | number, immediately: boolean): void {
    if (this.player === undefined) {
      return;
    }

    if (typeof rendition === 'number') {
      if (immediately) {
        this.player.currentLevel = rendition;
      } else {
        this.player.loadLevel = rendition;
      }
      return;
    } else {
      const renditions = this.getRenditions();
      if (renditions !== undefined && renditions.length > 0) {
        for (let i = 0; i < renditions.length; i++) {
          if (renditions[i].bitrate === rendition.bitrate) {
            return this.setRendition(i,  immediately);
          }
        }
      }
    }
    return this.setRendition(-1,  immediately);
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
