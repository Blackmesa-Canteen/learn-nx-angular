import { inject, InjectionToken } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface IAmplifyOutputs {
  API?: {
    [key: string]: any;
  };
  custom: {
    API?: {
      [apiName: string]: {
        endpoint: string;
        region: string;
        apiName: string;
      };
    };
    [key: string]: any;
  }
}

export const AMPLIFY_OUTPUTS = new InjectionToken<Observable<IAmplifyOutputs>>('AMPlIFY_OUTPUTS', {
  factory: () => {
    const http = inject(HttpClient);
    return http.get<IAmplifyOutputs>('.well-known/amplify_outputs.json').pipe(
      shareReplay(1)
    );
  }
})
