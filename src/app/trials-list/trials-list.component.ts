import { Component, OnInit } from "@angular/core";

import { Trial } from "../types/trial";
import { TrialService } from "../services/trial.service";

enum sortDirection {
  asc,
  desc,
}

interface sortOption {
  defaultSortDirection: sortDirection;
}

interface sortOptions {
  id: sortOption;
  title: sortOption;
  phase: sortOption;
  lastUpdated: sortOption;
}

@Component({
  selector: "app-trials-list",
  templateUrl: "./trials-list.component.html",
  styleUrls: ["./trials-list.component.scss"],
})
export class TrialsListComponent implements OnInit {
  TRIAL_LIST_PAGE_LIMIT = 25;

  SORT_OPTIONS: sortOptions = {
    id: {
      defaultSortDirection: sortDirection.asc,
    },
    title: {
      defaultSortDirection: sortDirection.asc,
    },
    phase: {
      defaultSortDirection: sortDirection.asc,
    },
    lastUpdated: {
      defaultSortDirection: sortDirection.asc,
    },
  };

  loadingTrials = false;
  trials: Trial[] = [];
  selectedTrial: Trial | null;
  loadingTrialdetails = false;
  totalTrials = 0;
  pageNumber = 1;

  sort: keyof sortOptions = "lastUpdated";
  sortDirection: sortDirection = sortDirection.desc;

  constructor(private trialService: TrialService) {
    this.selectedTrial = null;
    this.loadingTrialdetails = false;
  }

  ngOnInit(): void {
    this.getTrials();
  }

  getTrials(): void {
    this.loadingTrials = true;

    this.trialService
      .getTrials({
        limit: this.TRIAL_LIST_PAGE_LIMIT,
        pageNumber: this.pageNumber,
      })
      .then((res) => {
        this.trials = res.results;
        this.totalTrials = res.totalTrials;
      })
      .finally(() => (this.loadingTrials = false));
  }

  get sortedTrials() {
    return this.trials.sort((a, b) => {
      let first = a;
      let second = b;

      // Swap first & second when sorting in descending order
      if (this.sortDirection === sortDirection.desc) {
        first = b;
        second = a;
      }

      const sortBy: keyof sortOptions = this.sort;
      const firstValue = first[sortBy]!;
      const secondValue = second[sortBy]!;

      return firstValue > secondValue ? 1 : firstValue === secondValue ? 0 : -1;
    });
  }

  sortBy(sortBy: keyof sortOptions): void {
    if (this.SORT_OPTIONS[sortBy] === undefined) {
      return;
    }

    // Invert sort direction when sorting by the same column
    if (this.sort === sortBy) {
      this.invertSortDirection();
      return;
    }

    this.sort = sortBy;
    this.sortDirection = this.SORT_OPTIONS[sortBy].defaultSortDirection;
  }

  get hasPrevPage(): boolean {
    return this.pageNumber > 1;
  }

  fetchPage(pageNumber: number) {
    this.pageNumber = pageNumber;

    this.getTrials();
  }

  get maxPage(): number {
    return Math.ceil(this.totalTrials / this.TRIAL_LIST_PAGE_LIMIT);
  }

  prevPage(): void {
    this.pageNumber = Math.max(this.pageNumber - 1, 1);

    this.getTrials();
  }

  get hasNextPage(): boolean {
    return this.pageNumber < this.maxPage;
  }

  nextPage(): void {
    this.pageNumber = this.pageNumber + 1;

    this.getTrials();
  }

  get pages(): Array<number> {
    return Array.from({ length: this.maxPage }, (_, i) => i + 1);
  }

  /**
   * Invert the current sort direction
   */
  invertSortDirection(): void {
    this.sortDirection =
      this.sortDirection === sortDirection.asc
        ? sortDirection.desc
        : sortDirection.asc;
  }

  selectTrial(trial: Trial) {
    if (this.selectedTrial?.trialId === trial.trialId) {
      return;
    }

    this.fetchTrial(trial.trialId);
  }

  fetchTrial(trialId: string): void {
    this.loadingTrialdetails = true;

    this.trialService.getSingleTrial(trialId).then((trial) => {
      this.loadingTrialdetails = false;
      this.selectedTrial = trial;
    });
  }

  onCloseDetails(): void {
    this.selectedTrial = null;
    this.loadingTrialdetails = false;
  }
}
