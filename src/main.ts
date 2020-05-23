import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Amplify Configuration
import Auth from '@aws-amplify/auth';
import Storage from '@aws-amplify/storage';
import awsmobile from './aws-exports';
Storage.configure(awsmobile);
Auth.configure(awsmobile);
// End Amplify Configuration

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
