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
  buffered: IStatsTimeRanges[];
  duration: number;
  droppedFrames: number;
  loadTime: number;
  played: IStatsTimeRanges[];
  seekable: IStatsTimeRanges[];
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

export interface IPlayerConfig {
  initialRenditionKbps?: number;
  initialRenditionIndex?: number;
}

export type PlayerClassType = MediaPlayerClass | Hls;

export abstract class Player<T> {
  public player: T;
  public playerType: PlayerType;
  stats: IStats;
  loadStartTime: number;

  updateStats = () => {
    this.stats = {
      buffered: Utils.timeRangesToIStatsTimeRanges(Utils.getBuffered(this.htmlPlayer)),
      droppedFrames: Utils.getDroppedFrames(this.htmlPlayer),
      duration: Utils.getDuration(this.htmlPlayer),
      loadTime: this.stats.loadTime,
      played: Utils.timeRangesToIStatsTimeRanges(Utils.getPlayed(this.htmlPlayer)),
      seekable: Utils.timeRangesToIStatsTimeRanges(Utils.getSeekable(this.htmlPlayer)),
    };
  }

  loadStart = () => {
    this.updateStats();
    if (this.stats.loadTime === -1) {
      this.loadStartTime = (new Date()).getTime();
    }
  }

  loadEnd = () => {
    this.updateStats();
    if (this.stats.loadTime === -1) {
      this.stats.loadTime = ((new Date()).getTime() - this.loadStartTime) / 1000;
    }
    this.updateStats();
  }

  protected constructor(protected url: string, protected htmlPlayer: HTMLVideoElement, protected config: IPlayerConfig) {
    this.resetStats();
    this.load();
  }

  abstract load(): void;

  abstract destroy(): void;

  abstract getRenditions(): IRendition[];

  abstract setRendition(rendition: IRendition | number, immediately: boolean): void;

  abstract getCurrentRendition(): IRendition;

  getStats(): IStats {
    return this.stats;
  }

  initListeners(): void {
    this.htmlPlayer.addEventListener('timeupdate', this.updateStats);
    this.htmlPlayer.addEventListener('loadstart', this.loadStart);
    this.htmlPlayer.addEventListener('canplay', this.loadEnd);
  }

  destroyListeners(): void {
    this.htmlPlayer.removeEventListener('timeupdate', this.updateStats);
    this.htmlPlayer.removeEventListener('loadstart', this.loadStart);
    this.htmlPlayer.removeEventListener('canplay', this.loadEnd);
  }

  protected reset(): void {
    this.destroyListeners();
    this.resetStats();
  }

  protected resetStats(): void {
    this.stats = {
      buffered: [],
      duration: 0,
      droppedFrames: 0,
      loadTime: -1,
      played: [],
      seekable: [],
    };
  }
}
