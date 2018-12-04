import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MediaPlayer, MediaPlayerClass } from 'dashjs';
import * as Hls from 'hls.js';

enum PlayerType {
  DASH,
  HLS,
}

export interface IEvent {
  type: string;
  data?: any;
}

@Component({
  selector: 'vp-ngx-epic-video-player',
  templateUrl: './ngx-epic-video-player.component.html',
  styleUrls: ['./ngx-epic-video-player.component.scss']
})
export class NgxEpicVideoPlayerComponent implements OnInit, OnDestroy {

  @ViewChild('player') playerDomElement: ElementRef<HTMLVideoElement>;

  player: MediaPlayerClass | Hls;
  playerType: PlayerType;
  autoPlay = true;

  /**
   * Regular HTML video event emitters
   */
  @Output() abortEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() canplayEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() canplaythroughEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() durationchangeEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() emptiedEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() endedEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() errorEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() loadeddataEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() loadedmetadataEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() loadstartEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() pauseEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() playEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() playingEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() progressEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() ratechangeEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() seekedEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() seekingEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() stalledEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() suspendEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() timeupdateEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() volumechangeEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();
  @Output() waitingEvent: EventEmitter<IEvent> = new EventEmitter<IEvent>();


  url: string;
  @Input('url')
  set setUrl(value: string) {
    if (this.url !== value) {
      this.url = value;
      this.loadPlayer();
    }
  }

  /**
   * video
   */
  abortListener =           () => this.abortEvent.emit({type: 'abort'});
  canplayListener =         () => this.canplayEvent.emit({type: 'canplay'});
  canplaythroughListener =  () => this.canplaythroughEvent.emit({type: 'canplaythrough'});
  durationchangeListener =  () => this.durationchangeEvent.emit({type: 'durationchange'});
  emptiedListener =         () => this.emptiedEvent.emit({type: 'emptied'});
  endedListener =           () => this.endedEvent.emit({type: 'ended'});
  errorListener =           () => this.errorEvent.emit({type: 'error'});
  loadeddataListener =      () => this.loadeddataEvent.emit({type: 'loadeddata'});
  loadedmetadataListener =  () => this.loadedmetadataEvent.emit({type: 'loadedmetadata'});
  loadstartListener =       () => this.loadstartEvent.emit({type: 'loadstart'});
  pauseListener =           () => this.pauseEvent.emit({type: 'pause'});
  playListener =            () => this.playEvent.emit({type: 'play'});
  playingListener =         () => this.playingEvent.emit({type: 'playing'});
  progressListener =        () => this.progressEvent.emit({type: 'progress'});
  ratechangeListener =      () => this.ratechangeEvent.emit({type: 'ratechange', data: {playbackRate: this.playbackRate()}});
  seekedListener =          () => this.seekedEvent.emit({type: 'seeked'});
  seekingListener =         () => this.seekingEvent.emit({type: 'seeking'});
  stalledListener =         () => this.stalledEvent.emit({type: 'stalled'});
  suspendListener =         () => this.suspendEvent.emit({type: 'suspend'});
  timeupdateListener =      () => this.timeupdateEvent.emit({type: 'timeupdate', data: {currentTime: this.currentTime()}});
  volumechangeListener =    () => this.volumechangeEvent.emit({type: 'volumechange', data: {volume: this.volume()}});
  waitingListener =         () => this.waitingEvent.emit({type: 'waiting'});

  constructor() { }

  ngOnInit() { }

  ngOnDestroy() {
    this.destroyPlayer();
  }

  pause() {
    this.playerDomElement.nativeElement.pause();
  }

  play() {
    this.playerDomElement.nativeElement.play();
  }

  currentTime(secs?: number): void | number {
    if (secs !== undefined) {
      (this.playerDomElement.nativeElement as HTMLVideoElement).currentTime = secs;
    } else {
      return (this.playerDomElement.nativeElement as HTMLVideoElement).currentTime;
    }
  }

  volume(perc?: number): void | number {
    if (perc !== undefined) {
      (this.playerDomElement.nativeElement as HTMLVideoElement).volume = perc;
    } else {
      return (this.playerDomElement.nativeElement as HTMLVideoElement).volume;
    }
  }

  playbackRate(rate?: number): void | number {
    if (rate !== undefined) {
      (this.playerDomElement.nativeElement as HTMLVideoElement).playbackRate = rate;
    } else {
      return (this.playerDomElement.nativeElement as HTMLVideoElement).playbackRate;
    }
  }

  private loadPlayer() {
    try {
      this.destroyPlayer();
      const filename = this.url.substr(this.url.lastIndexOf('/') + 1);
      const extension = filename.split('.').pop();
      if (extension === 'm3u8') {
        this.loadHlsPlayer();
      } else {
        this.loadDashPlayer();
      }
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('abort', this.abortListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('canplay', this.canplayListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('canplaythrough', this.canplaythroughListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('durationchange', this.durationchangeListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('emptied', this.emptiedListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('ended', this.endedListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('error', this.errorListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('loadeddata', this.loadeddataListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('loadedmetadata', this.loadedmetadataListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('loadstart', this.loadstartListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('pause', this.pauseListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('play', this.playListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('playing', this.playingListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('progress', this.progressListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('ratechange', this.ratechangeListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('seeked', this.seekedListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('seeking', this.seekingListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('stalled', this.stalledListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('suspend', this.suspendListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('timeupdate', this.timeupdateListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('volumechange', this.volumechangeListener);
      (this.playerDomElement.nativeElement as HTMLVideoElement).addEventListener('waiting', this.waitingListener);
    } catch (e) {
      console.error(e);
    }
  }

  private destroyPlayer() {
    switch (this.playerType) {
      case PlayerType.DASH:
        return this.destroyDashPlayer();
      case PlayerType.HLS:
        return this.destroyHlsPlayer();
      default:
        return;
    }
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('abort', this.abortListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('canplay', this.canplayListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('canplaythrough', this.canplaythroughListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('durationchange', this.durationchangeListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('emptied', this.emptiedListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('ended', this.endedListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('error', this.errorListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('loadeddata', this.loadeddataListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('loadedmetadata', this.loadedmetadataListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('loadstart', this.loadstartListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('pause', this.pauseListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('play', this.playListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('playing', this.playingListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('progress', this.progressListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('ratechange', this.ratechangeListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('seeked', this.seekedListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('seeking', this.seekingListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('stalled', this.stalledListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('suspend', this.suspendListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('timeupdate', this.timeupdateListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('volumechange', this.volumechangeListener);
    (this.playerDomElement.nativeElement as HTMLVideoElement).removeEventListener('waiting', this.waitingListener);
  }

  private loadDashPlayer() {
    try {
      this.player = MediaPlayer().create();
      this.player.getDebug().setLogToBrowserConsole(false);
      this.player.initialize(this.playerDomElement.nativeElement, this.url, false);
      this.playerType = PlayerType.DASH;
    } catch (e) {
      console.error(e);
    }
  }

  private destroyDashPlayer() {
    try {
      this.player.reset();
      this.playerType = undefined;
    } catch (e) {
      console.error(e);
    }
  }

  private loadHlsPlayer() {
    try {
      if (Hls.isSupported()) {
        this.player = new Hls();
        this.player.loadSource(this.url);
        this.player.attachMedia(this.playerDomElement.nativeElement);
      } else if (this.playerDomElement.nativeElement.canPlayType('application/vnd.apple.mpegurl')) {
        this.playerDomElement.nativeElement.src = 'this.url';
      }
      this.playerType = PlayerType.HLS;
    } catch (e) {
      console.error(e);
    }
  }

  private destroyHlsPlayer() {
    try {
      this.player.destroy();
      this.playerType = undefined;
    } catch (e) {
      console.error(e);
    }
  }
}
