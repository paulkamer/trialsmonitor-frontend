import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { Trial } from '../trial';
import { Aws4SignerProxy } from '../../lib/Aws4SignerProxy';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrialService {

  constructor(private http: HttpClient) { }

  async getTrials({ limit }): Promise<Trial[]> {
    let url = `${environment.apiHost}${environment.trialsListUrl}`;

    if (limit) { url += `?limit=${limit}`; }

    const { headers } = await new Aws4SignerProxy().sign({ url });

    return this.http.get<Trial[]>(url, { headers })
      .pipe(
        map((res: any) => JSON.parse(res.body).results)
      ).toPromise();
  }

  async getSingleTrial(trialId: string): Promise<Trial> {
    const url = `${environment.apiHost}${environment.trialFetchSingleUrl}/${trialId}`;

    const { headers } = await new Aws4SignerProxy().sign({ url });

    return this.http.get<Trial>(url, { headers })
      .pipe(
        map((res: any) => res.results[0])
      ).toPromise();
  }
}
