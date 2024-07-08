import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { DataSourceActions } from '../../store/data-source/data-source.actions';
import { DatasetVersion } from '../../store/data-source/data-source.model';
import { DataSourceSelectors } from '../../store/data-source/data-source.selectors';
import { PryDialogRef } from '../overlay/dialog-ref';
import { PRY_DIALOG_DATA } from '../overlay/dialog.service';

@Component({
  selector: 'pry-status-modal',
  templateUrl: 'status-modal.component.html'
})
export class PryStatusModalComponent {
  @Output() gotoConsult = new EventEmitter<DatasetVersion>();
  datasetPreviews$?: Observable<
    {
      datasetVersionId: string;
      extractMessageCode: string;
      level: 'ERROR' | 'WARNING';
      name: string;
      recordId: string;
      type: string;
    }[]
  >;
  messageCount$?: Observable<number>;
  _version?: DatasetVersion;

  constructor(
    private store: Store,
    private dialogRef: PryDialogRef<PryStatusModalComponent>,
    @Inject(PRY_DIALOG_DATA)
    private data: { version: DatasetVersion }
  ) {
    this._version = data.version;
    if (!!this._version) {
      this.store.dispatch(DataSourceActions.dataset.previews.getById({ id: this._version.id }));
      this.datasetPreviews$ = this.store.select(DataSourceSelectors.datasetPreviews).pipe(
        map((previews) =>
          previews
            .map((preview) => preview.messages)
            .flat()
            .map((preview) => ({
              ...preview,
              name: (preview.name ?? '').split(',').join(', ')
            }))
        )
      );
      this.messageCount$ = this.store.select(DataSourceSelectors.datasetPreviews).pipe(
        map((previews) => {
          return previews.map((preview) => preview.count).reduce((p, c) => p + c, 0);
        })
      );
    }
  }

  close() {
    this.dialogRef.close();
  }
}
