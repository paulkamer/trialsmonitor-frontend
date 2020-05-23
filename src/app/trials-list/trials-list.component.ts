import { Component, OnInit } from '@angular/core';

import { Trial } from '../trial';
import { TrialService } from '../services/trial.service';

enum sortDirection {
  asc,
  desc
};

interface sortOption {
  defaultSortDirection: sortDirection;
}

interface sortOptions {
  id: sortOption;
  title: sortOption;
  phase: sortOption;
  lastUpdated: sortOption;
};

@Component({
  selector: 'app-trials-list',
  templateUrl: './trials-list.component.html',
  styleUrls: ['./trials-list.component.scss']
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

  trials: Trial[] = [];
  selectedTrial: Trial | null;

  sort: keyof sortOptions = 'lastUpdated';
  sortDirection: sortDirection = sortDirection.desc;

  constructor (private trialService: TrialService) {
    this.selectedTrial = null;
  }

  ngOnInit(): void {
    this.getTrials();
  }

  getTrials(): void {
    this.trialService.getTrials({ limit: this.TRIAL_LIST_PAGE_LIMIT })
      .then(trials => this.trials = trials);
  }

  get sortedTrials () {
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
    })
  }

  sortBy (sortBy: keyof sortOptions): void {
    if (this.SORT_OPTIONS[sortBy] === undefined) return;

    // Invert sort direction when sorting by the same column
    if (this.sort === sortBy) {
      this.invertSortDirection();
      return
    }

    this.sort = sortBy;
    this.sortDirection = this.SORT_OPTIONS[sortBy].defaultSortDirection;
  }

  /**
   * Invert the current sort direction
   */
  invertSortDirection (): void {
    this.sortDirection = this.sortDirection ===sortDirection.asc ?sortDirection.desc :sortDirection.asc;
  }

  selectTrial(trial: Trial) {
    if (this.selectedTrial && this.selectedTrial.id == trial.id) return;

    this.fetchTrial(trial.id);
  }

  fetchTrial(trialId: string): void {
    this.trialService.getSingleTrial(trialId)
        .then((trial) => this.selectedTrial = trial);
  }
}
