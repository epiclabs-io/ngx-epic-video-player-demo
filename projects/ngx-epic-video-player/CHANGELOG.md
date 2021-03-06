# Changelog

This document will track the changes of this project, based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) proposed schema.

## Wanted features / Roadmap
- Expose player options and events from dashjs and hls.js.
- Add MP4 and WEBM compatibility.
- Add Youtube compatibility (take a look to [ngx-youtube-player](https://github.com/orizens/ngx-youtube-player)).

## [1.0.6]
### [Fixed]
- Emmiting error events from dash.js and hls.js.

## [1.0.4]
### [Changed]
- *immediate* for *player.setRendition()* only works on players providing this feature (i.e., it will NOT provide an immediate rendition change on Dashjs).
### [Added]
- Added *initialRenditionKbps* attribute to set the desired initial rendition for Dash.
- Added *initialRenditionIndex* attribute to set the desired initial rendition for Hls.
- Added *poster* attribute to set the poster attribute of native video element.
### [Fixed]
- Better error management.

## [1.0.3]
### [Fixed]
- Avoiding errors retrieving/setting renditions when browser does not support it. 
### [Added]
- Added parameter to *player.setRendition()* method to force an immediate rendition change.

## [1.0.2]
### [Fixed]
- Loading time was being recalculated after some events and when video was in loop mode.
### [Added]
- Attaching audio & video codecs info to the renditions for Dash.js.


## [1.0.1]
### [Added]
- New method to retrieve video stats (dropped frames, loading time, buffered, etc).
- New methods to get and set the video renditions.
- Improving the demo project to see the above features in action.

## [1.0.0]
### [Changed]
- Created a class structure to manage the player types and keep things clean and ordered.
- Property `id` renamed to `videoId` to avoid conflicts due to repeated ids.
### [Added]
- Inner HTML `<video>` element has been exposed.

## [0.0.7]
### Added
- Included the following properties to be applied over the HTML video element:
  - `id`
  - `autoplay`
  - `controls`
  - `loop`
  - `muted`

## [0.0.4]
### Added
- Exposing all the events from the HTML video element.
- Exposing some methods from [HTMLMediaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) (please refer to [README](./README.md) for more info).
  
## [0.0.3]
### Added
- Simple support (only video playback) for DASH and HLS protocols based on [dashjs](https://github.com/Dash-Industry-Forum/dash.js) and [hls.js](https://github.com/video-dev/hls.js) libraries.
