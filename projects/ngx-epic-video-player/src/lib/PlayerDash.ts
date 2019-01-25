import { BitrateInfo, MediaPlayer, MediaPlayerClass } from 'dashjs';
import { IRendition, Player, PlayerType, IPlayerConfig } from './Player';

export class PlayerDash extends Player<MediaPlayerClass> {
  constructor(url: string, htmlPlayer: HTMLVideoElement, config: IPlayerConfig) {
    super(url, htmlPlayer, config);
  }

  load(): void {
    this.reset();
    try {
      this.player = MediaPlayer().create();
      this.player.getDebug().setLogToBrowserConsole(false);
      this.player.initialize(this.htmlPlayer, this.url, false);

      // an initial rendition needs to be loaded
      if (this.config && typeof this.config.initialRenditionKbps === 'number') {
        this.player.setAutoSwitchQualityFor('video', false);
        this.player.enableLastBitrateCaching(false);
        this.player.setInitialBitrateFor('video', this.config.initialRenditionKbps);
      }

      this.initListeners();
      this.playerType = PlayerType.DASH;
    } catch (e) {
      console.error(e);
    }
  }

  destroy(): void {
    try {
      if (this.player !== undefined) {
        this.player.reset();
      }
      this.playerType = undefined;
    } catch (e) {
      console.warn(e);
    }
  }

  getRenditions(): IRendition[] {
    if (this.player === undefined) {
      return;
    }

    return this.convertBitratesToIRenditions(this.player.getBitrateInfoListFor('video'));
  }

  setRendition(rendition: IRendition | number, immediately: boolean): void {
    if (this.player === undefined) {
      return;
    }

    if (typeof rendition === 'number') {
      if (rendition === -1) {
        this.player.setAutoSwitchQualityFor('video', true);
      } else {
        this.player.setAutoSwitchQualityFor('video', false);
        this.player.enableLastBitrateCaching(false);
        this.player.setQualityFor('video', rendition);
        if (immediately) {
          // dash.js does not provide this feature yet
        }
      }
      return;
    } else {
      const renditions = this.getRenditions();
      if (renditions !== undefined && renditions.length > 0) {
        for (let i = 0; i < renditions.length; i++) {
          if (renditions[i].bitrate === rendition.bitrate) {
            return this.setRendition(i, immediately);
          }
        }
      }
    }
    return this.setRendition(-1, immediately);
  }

  getCurrentRendition(): IRendition {
    if (this.player === undefined) {
      return;
    }

    const renditions = this.getRenditions();
    if (renditions !== undefined && renditions.length > 0) {
      const currentQuality = this.player.getQualityFor('video');
      if (currentQuality >= 0 && renditions.length > currentQuality) {
        return renditions[currentQuality];
      }
    }
    return;
  }

  private convertBitratesToIRenditions(bitrates: BitrateInfo[]): IRendition[] {
    const videoInfo = this.player.getCurrentTrackFor('video');
    const audioInfo = this.player.getCurrentTrackFor('audio');
    if (bitrates === undefined || bitrates.length === 0) { return; }
    return bitrates.map((b: BitrateInfo) => {
      return {
        bitrate: b.bitrate !== undefined ? b.bitrate : undefined,
        height: b.height !== undefined ? b.height : undefined,
        level: b.qualityIndex !== undefined ? b.qualityIndex : undefined,
        width: b.width !== undefined ? b.width : undefined,
        videoCodec: videoInfo && videoInfo.codec ? this.getCodecName(videoInfo.codec) : undefined,
        audioCodec: audioInfo && audioInfo.codec ? this.getCodecName(audioInfo.codec) : undefined,
      };
    });
  }

  private getCodecName(codec: string): string {
    const re = /"(.*?)"/g;
    const codecName = re.exec(codec);
    if (codecName !== undefined && !!codecName[1]) {
      return codecName[1];
    }
    return;
  }
}
