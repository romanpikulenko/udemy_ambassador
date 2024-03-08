import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp } from './app.initializer';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
  {
    provide: APP_INITIALIZER,
    useFactory: initializeApp,
    multi: true,
  }, provideAnimationsAsync(),
  ]
};
