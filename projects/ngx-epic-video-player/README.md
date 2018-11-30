# ngx-epic-video-player

Angular 2+ library to wrap several video players. 

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

3. Make use of it in one of your templates living under the module in which you imported the library:

```
<vp-ngx-epic-video-player url="https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"></vp-ngx-epic-video-player>
```
