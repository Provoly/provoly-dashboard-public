import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dataset, DatasetVersion, DataSourceSelectors } from '@provoly/dashboard';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'pry-dataset-card',
  templateUrl: './dataset-card.component.html'
})
export class PryDatasetCardComponent implements OnInit {
  @Input() dataset!: Dataset;
  @Output() consult = new EventEmitter<Dataset>();
  datasetVersions$!: Observable<DatasetVersion[]>;
  activeVersion$!: Observable<string | undefined>;
  constructor(private store: Store) {}
  ngOnInit() {
    this.datasetVersions$ = this.store
      .select(DataSourceSelectors.matchingDatasetVersions(this.dataset.id))
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
  goToDetailView() {
    this.consult.emit(this.dataset);
  }
}
