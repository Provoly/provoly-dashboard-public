import { AfterContentInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { DataSource, DatasetVersion } from '../../../../../core/store/data-source/data-source.model';
import { DataSourceSelectors } from '../../../../../core/store/data-source/data-source.selectors';

import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'pry-datasource-card',
  templateUrl: './datasource-card.component.html'
})
export class PryDatasourceCardComponent implements AfterContentInit {
  @Input() datasource!: DataSource;
  @Input() showFooter: boolean = false;
  @Input() isSelectable: boolean = false;
  @Input() isSelected: boolean = false;

  @Output() clicked = new EventEmitter<{ datasource: DataSource; isSelected: boolean; }>();

  datasetVersions$!: Observable<DatasetVersion[]>;
  activeVersion$!: Observable<string | undefined>;

  constructor(private store: Store) {}

  ngAfterContentInit() {
    this.datasetVersions$ = this.store
      .select(DataSourceSelectors.matchingDatasetVersions(this.datasource.id))
      .pipe(map((res) => [...res].sort((a, b) => b.version - a.version)));
    this.activeVersion$ = this.datasetVersions$.pipe(
      map(
        (versions) =>
          versions.sort((v1, v2) => v2.version - v1.version).find((version) => version.state === 'ACTIVE')?.lastModified
      )
    );
  }

  truncateDescription(description: string | undefined, maxLength: number): string {
    if (description && description.length > maxLength) {
      return description.slice(0, maxLength) + '...';
    }
    return <string>description;
  }

  onClick() {
    if (this.isSelectable) {
      this.isSelected = !this.isSelected;
      this.clicked.emit({ isSelected: this.isSelected, datasource: this.datasource });
    } else {
      this.clicked.emit({ isSelected: false, datasource: this.datasource });
    }
  }
}
