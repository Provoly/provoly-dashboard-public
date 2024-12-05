import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ClassActions, ConfigActions, Dataset, FieldActions, ViewMode } from '@provoly/dashboard';

@Component({
  selector: 'pry-dataset',
  templateUrl: './dataset.component.html'
})
export class PryDatasetComponent {
  selectedDataset?: Dataset;
  selectedMode: ViewMode = ViewMode.CATALOG;
  ViewMode = ViewMode;

  constructor(protected store: Store<any>) {
    this.store.dispatch(ClassActions.load({}));
    this.store.dispatch(FieldActions.load({}));
    this.store.dispatch(ConfigActions.loadCustomization({}));
  }

  consult(dataset: Dataset) {
    this.selectedDataset = dataset;
    this.selectedMode = ViewMode.CONSULT;
  }
}
