import { MediaPlayerClass } from 'dashjs';
import * as Hls from 'hls.js';
import { Utils } from './Utils';

export enum PlayerType {
  DASH,
  HLS,
}

export interface IStatsTimeRanges {
  start: number;
  end: number;
}

export interface IStats {
  duration: number;
  droppedFrames: number;
  buffered: IStatsTimeRanges[];
  seekable: IStatsTimeRanges[];
  played: IStatsTimeRanges[];
}

export interface IRendition {
  audioCodec?: string;
  bitrate: number;
  height: number;
  level?: number;
  name?: string;
  videoCodec?: string;
  width: number;
}

export type PlayerClassType = MediaPlayerClass | Hls;

export abstract class Player<T> {
  public player: T;
  public playerType: PlayerType;
  stats: IStats;

  updateStats = () => {
    this.stats = {
      duration: Utils.getDuration(this.htmlPlayer),
      droppedFrames: Utils.getDroppedFrames(this.htmlPlayer),
      buffered: Utils.timeRangesToIStatsTimeRanges(Utils.getBuffered(this.htmlPlayer)),
      seekable: Utils.timeRangesToIStatsTimeRanges(Utils.getSeekable(this.htmlPlayer)),
      played: Utils.timeRangesToIStatsTimeRanges(Utils.getPlayed(this.htmlPlayer)),
    };
  }

  protected constructor(public url: string, public htmlPlayer: HTMLVideoElement) {
    this.resetStats();
    this.load();
  }

  abstract load(): void;

  abstract destroy(): void;

  abstract getRenditions(): IRendition[];

  abstract setRendition(rendition: IRendition | number): void;

  abstract getCurrentRendition(): IRendition;

  getStats(): IStats {
    return this.stats;
  }

  initListeners(): void {
    this.htmlPlayer.addEventListener('timeupdate', this.updateStats);
  }

  destroyListeners(): void {
    this.htmlPlayer.removeEventListener('timeupdate', this.updateStats);
  }

  protected reset(): void {
    this.destroyListeners();
    this.resetStats();
  }

  protected resetStats(): void {
    this.stats = {
      duration: 0,
      droppedFrames: 0,
      buffered: [],
      seekable: [],
      played: [],
    };
  }
}
