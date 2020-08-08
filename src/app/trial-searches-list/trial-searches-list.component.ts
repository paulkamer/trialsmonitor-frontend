import { Component, OnInit } from "@angular/core";

import { TrialSearch } from "../trial-search";
import { TrialSearchService } from "../services/trial-search.service";

const TRIAL_PLACEHOLDER = { _id: "", query: "" };

@Component({
  selector: "app-trial-searches-list",
  templateUrl: "./trial-searches-list.component.html",
  styleUrls: ["./trial-searches-list.component.scss"],
})
export class TrialSearchesListComponent implements OnInit {
  searches: TrialSearch[] = [];
  newTrial: TrialSearch = TRIAL_PLACEHOLDER;
  showAddNew: boolean = false;

  constructor(private trialSearchService: TrialSearchService) {}

  ngOnInit(): void {
    this.getTrialSearches();
  }

  resetNewTrial(): void {
    this.newTrial = TRIAL_PLACEHOLDER;
  }

  toggleShowAddNew() {
    this.showAddNew = !this.showAddNew;
  }

  getTrialSearches(): void {
    this.trialSearchService
      .getSearches()
      .then(
        (searches) =>
          (this.searches = searches.sort((a: TrialSearch, b: TrialSearch) =>
            a.query > b.query ? 1 : 0
          ))
      );
  }

  saveTrialSearch() {
    this.trialSearchService
      .saveTrialSearch(this.newTrial)
      .then(() => {
        this.resetNewTrial();
        this.getTrialSearches();
      })
      .catch((error) => console.error("Saving trial failed", error));
  }

  deleteTrialSearch(trialSearch: TrialSearch) {
    this.trialSearchService
      .deleteTrialSearch(trialSearch)
      .then(() => {
        this.getTrialSearches();
      })
      .catch((error) => console.error("Deleting trial failed", error));
  }
}
