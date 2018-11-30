import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxEpicVideoPlayerModule } from 'ngx-epic-video-player';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxEpicVideoPlayerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
