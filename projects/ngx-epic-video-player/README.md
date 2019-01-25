# ngx-epic-video-player

Angular 2+ library to wrap different video libraries (at the moment, [dashjs](https://github.com/Dash-Industry-Forum/dash.js) and [hls.js](https://github.com/video-dev/hls.js)).

To see a **live demo** [click here](https://ngx-epic-video-player-demo.herokuapp.com/).

*NB*: This library is in progress and it still lacks a lot of features that are needed to work with video in the real world. You are more than welcome to contribute, ask for features and buy me a beer (not PayPal, just ask me for my postal address and you can directly send me the beer :D).

# Installation

1. Install the dependency into your Angular 2+ project
    ```
    $ npm install ngx-epic-video-player
    ```

2. Import the ```NgxEpicVideoPlayerModule``` in the module in which you will use it (e.g., ```app.module.ts```):
    ```
    import { NgxEpicVideoPlayerModule } from 'ngx-epic-video-player';
    
    @NgModule({
      ...
      imports: [
        ...
        NgxEpicVideoPlayerModule,
      ],
      ...
    })
    ```

3. Make use of it in one of the components living under the module in which you imported the library:

    ```
    <vp-ngx-epic-video-player #evp [videoId]="'my-own-id'"
      url="https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd">
    </vp-ngx-epic-video-player>
    ```

4. Access to the component properties and methods through an Angular reference variable:

    ```
    @ViewChild('evp') evp: NgxEpicVideoPlayerComponent;
    
    ...

    this.evp.pause();
    console.log(this.evp.volume());
    this.evp.playbackRate(0.5)
    this.evp.play();
    
    ...
    ```
    
 5. The HTML ```<video>``` element has been also exposed, so you can operate directly against it:
 
    ```
    this.evp.getHtmlVideo().play();
    
    ```
    
    You can also do this if you set your own id with the 'videoId' property:
    ```
    document.getElementById('my-own-id').play();
        
    ```

# API

## Attributes

| Attribute                 | Type              | Default value | Description                                                                                                               |
|---------------------------|-------------------|---------------|---------------------------------------------------------------------------------------------------------------------------|
| **autoplay**              | boolean or string | undefined     | Whether or not the video should start playing as soon as it is loaded.                                                    |
| **controls**              | boolean or string | undefined     | Whether or not the video should show the controls like play, pause, etc.                                                  |
| **videoId**               | string            | undefined     | Id to be set to the inner HTML video element.                                                                             |
| **loop**                  | boolean or string | undefined     | Whether or not the video should start over again when finished.                                                           |
| **muted**                 | boolean or string | undefined     | Whether or not the audio should be muted. It sets the muted property to the video element, but also set the volume to 0.  |
| **url**                   | boolean or string | undefined     | The URL of the manifest for the video to be loaded.                                                                       |
| **initialRenditionKbps**  | number or string  | undefined     | The Kbps of the desired initial rendition (valid for Dash)                                                                |
| **initialRenditionIndex** | number or string  | undefined     | The index of the desired initial rendition (valid for Hls)                                                                |

## Methods

- **pause()**

  Pauses the video playback.

- **play()**
  
  Begins playback of the video.

- **currentTime(secs?: number)**

  It can receive a double indicating the number of seconds, in which case it will seek the video to the new time.
    
  If not parameters are provided it will return the current playback time in seconds.

- **volume(perc?: number)**

  It can receive a double (from 0.0 to 1.0) indicating the level of the volume, in which case it will set the volume to the new level.
    
  If not parameters are provided, it will return the current volume level.

- **playbackRate(rate?: number)**

  It can receive a double indicating the rate at which the video will be played back (1.0 by default).
    
  For negative numbers the video will be played backwards.
   
  If not parameters are provided it will return the current playback rate.
  
- **getStats()**

  Returns video stats in a IStats.
  
- **getRenditions()**
  
  Returns the renditions of the video as an array of IRendition.

- **setRendition(rendition: IRendition | number, immediately?: boolean)**

  Set the desired rendition. It will not drop the already buffered segments.
  
  If *rendition* is -1, the rendition selection will be set to automatic.
  
  If *immediately* is true, the buffer will be cleaned and the new rendition will be automatically rendered. In some cases (i.e. dashjs) it is not yet possible.

- **getCurrentRendition()**

  Returns the current rendition as a IRendition.
  
## Object interfaces

| Name              | Properties                                                                                                                                                        |
|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| IStatsTimeRanges  | start: number;<br>end: number;                                                                                                                                    |
| IStats            | buffered: IStatsTimeRanges[];<br>duration: number;<br>droppedFrames: number;<br>loadTime: number;<br>played: IStatsTimeRanges[];<br>seekable: IStatsTimeRanges[]; |
| IRendition        | audioCodec?: string;<br>bitrate: number;<br>height: number;<br>level?: number;<br>name?: string;<br>videoCodec?: string;<br>width: number;                        |


## Event emitters

- **abortEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **canplayEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **canplaythroughEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **durationchangeEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **emptiedEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **endedEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **errorEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **loadeddataEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **loadedmetadataEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **loadstartEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **playEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **playingEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **progressEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **ratechangeEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **seekedEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **seekingEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **stalledEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **suspendEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **timeupdateEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **volumechangeEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
- **waitingEvent** as defined by [W3C](https://www.w3.org/TR/2011/WD-html5-20110113/video.html#mediaevents)
