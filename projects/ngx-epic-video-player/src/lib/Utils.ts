import { IStatsTimeRanges } from './Player';

export class Utils {
  static getDroppedFrames(htmlVideo: HTMLVideoElement): number {
    if (!htmlVideo) { return; }
    const hasWebKit = ('webkitDroppedFrameCount' in htmlVideo) && ('webkitDecodedFrameCount' in htmlVideo);
    const hasQuality = ('getVideoPlaybackQuality' in htmlVideo);

    if (hasQuality) {
      return (htmlVideo as any).getVideoPlaybackQuality();
    } else if (hasWebKit) {
      return (htmlVideo as any).webkitDroppedFrameCount;
    }
    return;
  }

  static getDuration(htmlVideo: HTMLVideoElement): number {
    if (!htmlVideo) { return; }
    return htmlVideo.duration;
  }

  static getBuffered(htmlVideo: HTMLVideoElement): TimeRanges {
    if (!htmlVideo) { return; }
    return htmlVideo.buffered;
  }

  static getSeekable(htmlVideo: HTMLVideoElement): TimeRanges {
    if (!htmlVideo) { return; }
    return htmlVideo.seekable;
  }

  static getPlayed(htmlVideo: HTMLVideoElement): TimeRanges {
    if (!htmlVideo) { return; }
    return htmlVideo.played;
  }

  static timeRangesToIStatsTimeRanges(tr: TimeRanges): IStatsTimeRanges[] {
    const res: IStatsTimeRanges[] = [];
    for (let i = 0; i < tr.length; i++) {
      res.push({start: tr.start(i), end: tr.end(i)});
    }
    return res;
  }
}
