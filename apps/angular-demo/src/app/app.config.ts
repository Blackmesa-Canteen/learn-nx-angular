import {
  ApplicationConfig, inject, provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Amplify } from 'aws-amplify';
import { AMPLIFY_OUTPUTS } from '@angular-demo/webapp-shared';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideAppInitializer(async () => {
      const amplifyConfig$ = inject(AMPLIFY_OUTPUTS);
      const outputs = await firstValueFrom(amplifyConfig$);
      const restConfig: Record<string, any> = {};
      if (outputs.custom?.API) {
        Object.entries(outputs.custom.API).forEach(([key, value]) => {
          restConfig[key] = {
            endpoint: value.endpoint,
            region: value.region,
          };
        });
      }

      Amplify.configure({
        ...outputs,
        API: {
          REST: restConfig,
        },
      },
        {
          API: {
            REST: {
              retryStrategy: {
                strategy: 'no-retry' // Overrides default retry strategy
              },
            }
          },
        }
        );
    }),
  ],
};
