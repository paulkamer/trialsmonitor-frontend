import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { TrialSearch } from '../trial-search';
import { Aws4SignerProxy } from '../../lib/Aws4SignerProxy'
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrialSearchService {

  constructor(private http: HttpClient) { }

  /**
   * Fetch "trial search" queries.
   *
   * Returning a Promise instead of an Observable, because we're forced to use
   * async/await by Aws4SignerProxy
   */
  async getSearches(): Promise<TrialSearch[]> {
    const url = `${environment.apiHost}${environment.trialSearchesListUrl}`;

    const { headers } = await new Aws4SignerProxy().sign({ url });

    return this.http.get<TrialSearch[]>(url, { headers })
      .pipe(
        map((res: any) => res.results)
      ).toPromise();
  }

  /**
   * Save a new trial search query
   */
  async saveTrialSearch(trialSearch: TrialSearch): Promise<TrialSearch> {
    const url = `${environment.apiHost}${environment.trialSearchesSaveUrl}`;

    const body = JSON.stringify(trialSearch);
    const { headers } = await new Aws4SignerProxy().sign({
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body
    });

    return this.http.post<TrialSearch>(url, body, { headers }).toPromise();
  }

  /**
   * Delete a trial search query
   */
  async deleteTrialSearch(trialSearch: TrialSearch): Promise<{}> {
    const url = `${environment.apiHost}${environment.trialSearchesDeleteUrl}/${trialSearch.id}`;

    const { headers } = await new Aws4SignerProxy().sign({ url, method: 'DELETE' });

    return this.http.delete(url, { headers }).toPromise();
  }
}
