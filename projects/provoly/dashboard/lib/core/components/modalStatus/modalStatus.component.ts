import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DatasetError } from '../../model/dataset.interface';
import { DataSourceActions } from '../../store/data-source/data-source.actions';
import { DatasetVersion } from '../../store/data-source/data-source.model';
import { DataSourceSelectors } from '../../store/data-source/data-source.selectors';

@Component({
  selector: 'pry-modalStatus',
  templateUrl: 'modalStatus.component.html'
})
export class PryModalStatusComponent {
  @Output() gotoConsult = new EventEmitter<DatasetVersion>();
  datasetErrors$?: Observable<DatasetError[]>;
  _version?: DatasetVersion;

  @Input() set version(version: DatasetVersion | undefined) {
    this._version = version;
    if (!!version) {
      this.store.dispatch(DataSourceActions.dataset.errors.getById({ id: version.id }));
      this.datasetErrors$ = this.store.select(DataSourceSelectors.datasetErrors);
    }
  }

  constructor(private store: Store) {}

  goBack() {
    this.gotoConsult.emit(this.version);
  }
}
