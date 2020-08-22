import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

import { Trial } from "../types/trial";
import { Aws4SignerProxy } from "../../lib/Aws4SignerProxy";
import { environment } from "../../environments/environment";
import { TrialsResponse } from "../types/TrialsResponse";

@Injectable({
  providedIn: "root",
})
export class TrialService {
  constructor(private http: HttpClient) {}

  async getTrials({ limit, pageNumber }): Promise<TrialsResponse> {
    let url = `${environment.apiHost}${environment.trialsListUrl}`;

    const params = new URLSearchParams({ limit: limit });

    if (pageNumber) params.append("pageNumber", pageNumber);
    url += `?${params.toString()}`;

    const { headers } = await new Aws4SignerProxy().sign({ url });

    return this.http
      .get(url, { headers })
      .pipe(map((res: TrialsResponse) => res))
      .toPromise();
  }

  async getSingleTrial(trialId: string): Promise<Trial> {
    const url = `${environment.apiHost}${environment.trialFetchSingleUrl}/${trialId}`;

    const { headers } = await new Aws4SignerProxy().sign({ url });

    return this.http
      .get<Trial>(url, { headers })
      .pipe(map((res: any) => res.results[0]))
      .toPromise();
  }
}
