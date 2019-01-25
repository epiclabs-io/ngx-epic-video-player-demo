import { IRendition, Player, PlayerType, IPlayerConfig } from './Player';
import * as Hls from 'hls.js';

export class PlayerHls extends Player<Hls> {
  constructor(url: string, htmlPlayer: HTMLVideoElement, config: IPlayerConfig) {
    super(url, htmlPlayer, config);
  }

  load(): void {
    this.reset();
    try {
      if (Hls.isSupported()) {
        this.player = new Hls();
        this.player.loadSource(this.url);
        this.player.attachMedia(this.htmlPlayer);

        // an initial rendition needs to be loaded
        if (this.config && typeof this.config.initialRenditionIndex === 'number')  {
          this.player.startLevel = this.config.initialRenditionIndex;
        }

      // hls is not supported but the native player is able to load the video
      // some features (like renditions getter/setter) will NOT be available
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
      if (this.player !== undefined) {
        this.player.destroy();
      }
    } catch (e) {
      console.warn(e);
    } finally {
      this.playerType = undefined;
    }
  }

  getRenditions(): IRendition[] {
    if (this.player === undefined) {
      return;
    }

    return this.convertLevelsToIRenditions(this.player.levels);
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
    if (this.player === undefined) {
      return;
    }

    const renditions = this.getRenditions();
    if (renditions !== undefined && renditions.length > 0) {
      const currentLevel = this.player.currentLevel;
      if (currentLevel >= 0 && renditions.length > currentLevel) {
        return renditions[currentLevel];
      }
    }
    return;
  }

  // update any to Hls.Level[] after Hls.js typings fixing
  private convertLevelsToIRenditions(levels: any): IRendition[] {
    if (levels === undefined || levels.length === 0) { return; }
    return levels.map(l => {
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
