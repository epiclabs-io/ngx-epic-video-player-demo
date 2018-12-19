import { MediaPlayerClass } from 'dashjs';
import * as Hls from 'hls.js';

export enum PlayerType {
  DASH,
  HLS,
}

export type PlayerClassType = MediaPlayerClass | Hls;

export abstract class Player<T> {
  public player: T;
  public playerType: PlayerType;

  protected constructor(public url: string, public htmlPlayer: HTMLVideoElement) {
    this.load();
  }

  abstract load(): void;

  abstract destroy(): void;
}
