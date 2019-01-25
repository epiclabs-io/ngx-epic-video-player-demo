import { Component, EventEmitter, Input, OnDestroy, Output, ViewChild, ElementRef } from '@angular/core';
import { IRendition, IStats, Player, PlayerClassType } from './Player';
import { PlayerDash } from './PlayerDash';
import { PlayerHls } from './PlayerHls';

export interface IEvent {
  type: string;
  data?: any;
}

@Component({
  selector: 'vp-ngx-epic-video-player',
  templateUrl: './ngx-epic-video-player.component.html',
  styleUrls: ['./ngx-epic-video-player.component.scss']
})
export class NgxEpicVideoPlayerComponent implements OnDestroy {

  @ViewChild('htmlVideoRef') htmlVideoRef: ElementRef<HTMLVideoElement>;

  url: string;
  @Input('url')
  set setUrl(value: string) {
    if (this.url !== value) {
      this.destroy();
      this.url = value;

      if (value === undefined || value === '') {
        this.errorEvent.emit({type: 'error', 'data': { mssg: 'Provided video URL is empty.'}});
        return;
      }

      this.init();
    }
  }

  autoplay: boolean;
  @Input('autoplay')
  set setAutoplay(value: boolean) {
    this.autoplay = this.isTrue(value);
  }

  muted: boolean;
  @Input('muted')
  set setMuted(value: boolean | string) {
    this.muted = this.isTrue(value);
    if (this.muted) {
      this.volume(0);
    } else {
      this.volume(1);
    }
  }

  // initialRenditionkbps is used to be able to initialize Dashjs with a desired rendition (by bitrate in kbps of the rendition)
  initialRenditionKbps: number;
  @Input('initialRenditionKbps')
  set setInitialRenditionKbps(value: number) {
    value = value !== undefined ? parseInt(value.toString(), 10) : undefined;
    if (!isNaN(value) && value !== this.initialRenditionKbps) {
      this.initialRenditionKbps = value + 1;
      if (this.player !== undefined && !!this.url) {
        this.destroy();
        this.init();
      }
    }
  }

  // initialRenditionIndex is used to be able to initialize Hls.js with a desired rendition (by index of the renditions array)
  initialRenditionIndex: number;
  @Input('initialRenditionIndex')
  set setinitialRenditionIndex(value: number) {
    value = value !== undefined ? parseInt(value.toString(), 10) : undefined;
    if (!isNaN(value) && value !== this.initialRenditionKbps) {
      this.initialRenditionIndex = value;
      if (this.player !== undefined && !!this.url) {
        this.destroy();
        this.init();
      }
    }
  }

  @Input() poster: string;
  @Input() videoId: string;
  @Input() controls: boolean;
  @Input() loop: boolean;

  player: Player<PlayerClassType>;

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

  /**
   * Regular HTML video event listeners
   */
  abortListener =           (e) => this.abortEvent.emit({type: 'abort'});
  canplayListener =         (e) => this.canplayEvent.emit({type: 'canplay'});
  canplaythroughListener =  (e) => {
    this.canplaythroughEvent.emit({type: 'canplaythrough'});
    if (this.autoplay && this.getHtmlVideo().paused) { this.play(); }
  }
  durationchangeListener =  (e) => this.durationchangeEvent.emit({type: 'durationchange'});
  emptiedListener =         (e) => this.emptiedEvent.emit({type: 'emptied'});
  endedListener =           (e) => this.endedEvent.emit({type: 'ended'});
  errorListener =           (e) => this.errorEvent.emit({type: 'error', data: e});
  loadeddataListener =      (e) => this.loadeddataEvent.emit({type: 'loadeddata'});
  loadedmetadataListener =  (e) => this.loadedmetadataEvent.emit({type: 'loadedmetadata'});
  loadstartListener =       (e) => this.loadstartEvent.emit({type: 'loadstart'});
  pauseListener =           (e) => this.pauseEvent.emit({type: 'pause'});
  playListener =            (e) => this.playEvent.emit({type: 'play'});
  playingListener =         (e) => this.playingEvent.emit({type: 'playing'});
  progressListener =        (e) => this.progressEvent.emit({type: 'progress'});
  ratechangeListener =      (e) => this.ratechangeEvent.emit({type: 'ratechange', data: {playbackRate: this.playbackRate()}});
  seekedListener =          (e) => this.seekedEvent.emit({type: 'seeked'});
  seekingListener =         (e) => this.seekingEvent.emit({type: 'seeking'});
  stalledListener =         (e) => this.stalledEvent.emit({type: 'stalled'});
  suspendListener =         (e) => this.suspendEvent.emit({type: 'suspend'});
  timeupdateListener =      (e) => this.timeupdateEvent.emit({type: 'timeupdate', data: {currentTime: this.currentTime()}});
  volumechangeListener =    (e) => this.volumechangeEvent.emit({type: 'volumechange', data: {volume: this.volume()}});
  waitingListener =         (e) => this.waitingEvent.emit({type: 'waiting'});

  ngOnDestroy() {
    this.destroy();
  }

  isTrue(value: boolean | string): boolean {
    return value === true || value === 'true';
  }

  getStats(): IStats {
    return this.player.getStats();
  }

  getHtmlVideo(): HTMLVideoElement {
    return this.htmlVideoRef.nativeElement;
  }

  getRenditions(): IRendition[] {
    return this.player.getRenditions();
  }

  getCurrentRendition(): IRendition {
    return this.player.getCurrentRendition();
  }

  setRendition(rendition: IRendition | number, immediately?: boolean): void {
    return this.player.setRendition(rendition, immediately);
  }

  private init(): void {
    try {
      this.destroy();
      this.createPlayer();
      this.getHtmlVideo().addEventListener('abort', this.abortListener);
      this.getHtmlVideo().addEventListener('canplay', this.canplayListener);
      this.getHtmlVideo().addEventListener('canplaythrough', this.canplaythroughListener);
      this.getHtmlVideo().addEventListener('durationchange', this.durationchangeListener);
      this.getHtmlVideo().addEventListener('emptied', this.emptiedListener);
      this.getHtmlVideo().addEventListener('ended', this.endedListener);
      this.getHtmlVideo().addEventListener('error', this.errorListener);
      this.getHtmlVideo().addEventListener('loadeddata', this.loadeddataListener);
      this.getHtmlVideo().addEventListener('loadedmetadata', this.loadedmetadataListener);
      this.getHtmlVideo().addEventListener('loadstart', this.loadstartListener);
      this.getHtmlVideo().addEventListener('pause', this.pauseListener);
      this.getHtmlVideo().addEventListener('play', this.playListener);
      this.getHtmlVideo().addEventListener('playing', this.playingListener);
      this.getHtmlVideo().addEventListener('progress', this.progressListener);
      this.getHtmlVideo().addEventListener('ratechange', this.ratechangeListener);
      this.getHtmlVideo().addEventListener('seeked', this.seekedListener);
      this.getHtmlVideo().addEventListener('seeking', this.seekingListener);
      this.getHtmlVideo().addEventListener('stalled', this.stalledListener);
      this.getHtmlVideo().addEventListener('suspend', this.suspendListener);
      this.getHtmlVideo().addEventListener('timeupdate', this.timeupdateListener);
      this.getHtmlVideo().addEventListener('volumechange', this.volumechangeListener);
      this.getHtmlVideo().addEventListener('waiting', this.waitingListener);
    } catch (e) {
      console.error(e);
    }
  }

  private createPlayer(): void {
    const filename = this.url.substr(this.url.lastIndexOf('/') + 1);
    const extension = filename.split('.').pop();

    const config = {
      initialRenditionIndex: this.initialRenditionIndex,
      initialRenditionKbps: this.initialRenditionKbps,
    };

    if (extension === 'm3u8') {
      this.player = new PlayerHls(this.url, this.getHtmlVideo(), config);
    } else {
      this.player = new PlayerDash(this.url, this.getHtmlVideo(), config);
    }
  }

  private destroy(): void {
    this.getHtmlVideo().removeEventListener('abort', this.abortListener);
    this.getHtmlVideo().removeEventListener('canplay', this.canplayListener);
    this.getHtmlVideo().removeEventListener('canplaythrough', this.canplaythroughListener);
    this.getHtmlVideo().removeEventListener('durationchange', this.durationchangeListener);
    this.getHtmlVideo().removeEventListener('emptied', this.emptiedListener);
    this.getHtmlVideo().removeEventListener('ended', this.endedListener);
    this.getHtmlVideo().removeEventListener('error', this.errorListener);
    this.getHtmlVideo().removeEventListener('loadeddata', this.loadeddataListener);
    this.getHtmlVideo().removeEventListener('loadedmetadata', this.loadedmetadataListener);
    this.getHtmlVideo().removeEventListener('loadstart', this.loadstartListener);
    this.getHtmlVideo().removeEventListener('pause', this.pauseListener);
    this.getHtmlVideo().removeEventListener('play', this.playListener);
    this.getHtmlVideo().removeEventListener('playing', this.playingListener);
    this.getHtmlVideo().removeEventListener('progress', this.progressListener);
    this.getHtmlVideo().removeEventListener('ratechange', this.ratechangeListener);
    this.getHtmlVideo().removeEventListener('seeked', this.seekedListener);
    this.getHtmlVideo().removeEventListener('seeking', this.seekingListener);
    this.getHtmlVideo().removeEventListener('stalled', this.stalledListener);
    this.getHtmlVideo().removeEventListener('suspend', this.suspendListener);
    this.getHtmlVideo().removeEventListener('timeupdate', this.timeupdateListener);
    this.getHtmlVideo().removeEventListener('volumechange', this.volumechangeListener);
    this.getHtmlVideo().removeEventListener('waiting', this.waitingListener);

    if (this.player) {
      this.player.destroy();
    }
  }

  pause() {
    this.getHtmlVideo().pause();
  }

  play() {
    this.getHtmlVideo().play();
  }

  currentTime(secs?: number): void | number {
    if (secs !== undefined) {
      this.getHtmlVideo().currentTime = secs;
    } else {
      return this.getHtmlVideo().currentTime;
    }
  }

  volume(perc?: number): void | number {
    if (perc !== undefined) {
      this.getHtmlVideo().volume = perc;
    } else {
      return this.getHtmlVideo().volume;
    }
  }

  playbackRate(rate?: number): void | number {
    if (rate !== undefined) {
      this.getHtmlVideo().playbackRate = rate;
    } else {
      return this.getHtmlVideo().playbackRate;
    }
  }
}
