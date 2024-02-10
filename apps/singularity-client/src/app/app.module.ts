import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { TuiAlertModule, TuiDialogModule, TuiModeModule, TuiRootModule, TuiThemeNightModule } from '@taiga-ui/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TUI_ENGLISH_LANGUAGE, TUI_LANGUAGE } from '@taiga-ui/i18n';
import { of } from 'rxjs';
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
    TuiRootModule,
    TuiDialogModule,
    TuiThemeNightModule,
    TuiModeModule,
    TuiAlertModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    TranslocoRootModule
  ],
  providers: [
    {
      provide: TUI_LANGUAGE,
      useValue: of(TUI_ENGLISH_LANGUAGE),
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
