import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrialSearchesListComponent } from './trial-searches-list.component';

describe('TrialSearchesListComponent', () => {
  let component: TrialSearchesListComponent;
  let fixture: ComponentFixture<TrialSearchesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrialSearchesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrialSearchesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
