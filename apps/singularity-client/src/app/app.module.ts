import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import {
  SONG_AUDIOS_INDEXED_DB_SCHEMA,
  SONG_COVERS_INDEXED_DB_SCHEMA,
  SONG_VIDEOS_INDEXED_DB_SCHEMA,
  SONGS_INDEXED_DB_SCHEMA
} from './shared/indexd-db-schemas/songs';
import { ServiceWorkerModule } from '@angular/service-worker';
import { UnauthorizedInterceptor } from './interceptors/unauthorized.interceptor';
import { TranslocoRootModule } from './transloco-root.module';
import { SingularityUiModule } from '@singularity/ui';


const serviceWorkerScript =
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  (navigator['standalone'] || window.matchMedia('(display-mode: standalone)').matches) ?
  'ngsw-worker.js' : 'safety-worker.js';

@NgModule({
  declarations: [AppComponent],
  imports: [
    NgxIndexedDBModule.forRoot({
      name: 'SingularityDb',
      version: 1,
      objectStoresMeta: [
        SONGS_INDEXED_DB_SCHEMA,
        SONG_COVERS_INDEXED_DB_SCHEMA,
        SONG_VIDEOS_INDEXED_DB_SCHEMA,
        SONG_AUDIOS_INDEXED_DB_SCHEMA
      ]
    }),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ServiceWorkerModule.register(serviceWorkerScript, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    TranslocoRootModule,
    SingularityUiModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
