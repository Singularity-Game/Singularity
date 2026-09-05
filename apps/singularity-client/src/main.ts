import { enableProdMode, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import './polyfills';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

// bootstrapApplication(AppComponent, {
//   providers: [importProvidersFrom(AppModule)]
// })
//   .catch((err) => console.error(err));

platformBrowserDynamic()
  .bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
  .catch((err) => console.error(err));


// Remove all Service Workers to switch from safety-worker to ngsw-worker
addEventListener('appinstalled', () => {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach(registration => registration.unregister());
    navigator.serviceWorker.register('ngsw-worker.js').then(() => {
      location.reload();
    });
  });
});
