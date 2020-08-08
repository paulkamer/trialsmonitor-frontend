import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Trial } from '../trial';

@Component({
  selector: 'app-trial-detail',
  templateUrl: './trial-detail.component.html',
  styleUrls: ['./trial-detail.component.scss'],
})
export class TrialDetailComponent implements OnInit {
  @Input() trial: Trial | null;
  @Input() isLoading: boolean;

  @Output() closer = new EventEmitter<boolean>();

  constructor() {
    this.trial = null;
    this.isLoading = false;
  }

  ngOnInit(): void {}

  close() {
    this.closer.emit();
  }
}
