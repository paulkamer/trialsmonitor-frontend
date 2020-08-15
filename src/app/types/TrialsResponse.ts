import { Trial } from "./trial";

export class TrialsResponse {
  constructor(
    public results: Trial[],
    public results_count: number,

    public totalTrials: number,
    public limit: number,
    public offset: number
  ) {}
}
