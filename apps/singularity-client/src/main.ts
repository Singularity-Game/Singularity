import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
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
