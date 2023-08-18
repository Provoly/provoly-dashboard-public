import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { DatasetMessage } from '../../model/dataset.interface';
import { DataSourceActions } from '../../store/data-source/data-source.actions';
import { DatasetVersion } from '../../store/data-source/data-source.model';
import { DataSourceSelectors } from '../../store/data-source/data-source.selectors';

@Component({
  selector: 'pry-modal-status',
  templateUrl: 'modal-status.component.html'
})
export class PryModalStatusComponent {
  @Output() gotoConsult = new EventEmitter<DatasetVersion>();
  datasetPreviews$?: Observable<
    {
      count: number;
      datasetVersionId: string;
      extractErrorCode: string;
      level: 'ERROR' | 'WARNING';
      name: string;
      recordID: string;
      type: string;
    }[]
  >;
  _version?: DatasetVersion;

  @Input() set version(version: DatasetVersion | undefined) {
    this._version = version;
    if (!!version) {
      this.store.dispatch(DataSourceActions.dataset.previews.getById({ id: version.id }));
      this.datasetPreviews$ = this.store
        .select(DataSourceSelectors.datasetPreviews)
        .pipe(
          map((previews) =>
            previews
              .map((preview) =>
                preview.messages.map((message) => ({ ...message, level: preview.level, count: preview.count }))
              )
              .flat()
          )
        );
    }
  }

  constructor(private store: Store) {}

  goBack() {
    this.gotoConsult.emit(this.version);
  }
}
