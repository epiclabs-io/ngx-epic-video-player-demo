# Changelog

This document will track the changes of this project, based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) proposed schema.

## Wanted features / Roadmap
- Expose player options and events from dashjs and hls.js.
- Add Youtube compatibility (most probably through [ngx-youtube-player](https://github.com/orizens/ngx-youtube-player)).

## [0.0.4]
### Added
- Exposing all the events from the HTML video element.
- Exposing some methods from [HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) (please refer to [README](./README.md) for more info).
  
## [0.0.3]
### Added
- Simple support (only video playback) for DASH and HLS protocols based on [dashjs](https://github.com/Dash-Industry-Forum/dash.js) and [hls.js](https://github.com/video-dev/hls.js) libraries.
