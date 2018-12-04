# ngx-epic-video-player

Angular 2+ library to wrap different video libraries (at the moment, [dashjs](https://github.com/Dash-Industry-Forum/dash.js) and [hls.js](https://github.com/video-dev/hls.js)).

NB: This library is in progress and it still lacks a lot of features that are needed to work with video in the real world. You are more than welcome to contribute, ask for features and buy me a beer (not PayPal, just ask me for my postal address and you can directly send me the beer :D).

# Installation

1. Install the dependency into your Angular 2+ project
    ```
    $ npm install ngx-epic-video-player
    ```

2. Import the ```NgxEpicVideoPlayerModule``` in the module in which you will use it (e.g., ```app.module.ts```):
    ```
    import { NgxEpicVideoPlayerModule } from 'ngx-epic-video-player';
    ```
    and
    ```
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
    <vp-ngx-epic-video-player #player
      url="https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd">
    </vp-ngx-epic-video-player>
    ```

4. Access to the component properties and methods through an Angular reference variable

    ```
    @ViewChild('player') player: NgxEpicVideoPlayerComponent;
    
    ...

    this.player.pause();
    console.log(this.player.volume());
    this.player.playbackRate(0.5)
    this.player.play();
    
    ...
    ```

# API

## Properties

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
