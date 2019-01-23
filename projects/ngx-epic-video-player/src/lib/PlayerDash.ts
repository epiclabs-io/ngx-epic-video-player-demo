import { BitrateInfo, MediaPlayer, MediaPlayerClass } from 'dashjs';
import { IRendition, Player, PlayerType } from './Player';

interface ILoadConfig {
  rendition?: number;
  time?: number;
}

export class PlayerDash extends Player<MediaPlayerClass> {
  constructor(url: string, htmlPlayer: HTMLVideoElement) {
    super(url, htmlPlayer);
  }

  load(config?: ILoadConfig): void {
    this.reset();
    try {
      this.player = MediaPlayer().create();
      this.player.getDebug().setLogToBrowserConsole(false);
      let url = this.url;
      if (config && config.time !== undefined && typeof config.time === 'number') {
        url += `#s=${config.time}`;
      }
      this.player.initialize(this.htmlPlayer, url, false);
      if (config && config.rendition !== undefined && typeof config.rendition === 'number') {
        this.player.setInitialBitrateFor('video', config.rendition);
      }
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
    if (this.player !== undefined) {
      return this.convertBitratesToIRenditions(this.player.getBitrateInfoListFor('video'));
    }
  }

  setRendition(rendition: IRendition | number, immediately: boolean): void {
    if (typeof rendition === 'number') {
      if (rendition === undefined || rendition === -1) {
        this.player.setAutoSwitchQualityFor('video', true);
      } else {
        this.player.setAutoSwitchQualityFor('video', false);
        this.player.enableLastBitrateCaching(false);
        this.player.setQualityFor('video', rendition);
        if (immediately) {
          // dash.js does not provide this feature so we need to reload the player
          this.load({rendition, time: this.player.time()});
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
