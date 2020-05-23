import { Component, OnInit, Input } from '@angular/core';

import { Trial } from '../trial';

@Component({
  selector: 'app-trial-detail',
  templateUrl: './trial-detail.component.html',
  styleUrls: ['./trial-detail.component.scss']
})
export class TrialDetailComponent implements OnInit {
  @Input() trial: Trial | null;

  constructor() {
    this.trial = null;
  }

  ngOnInit(): void { }
}
