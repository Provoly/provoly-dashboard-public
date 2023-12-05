import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { ManifestDescription } from '../../../core/model/manifest.interface';
import { DashboardActions } from '../../store/dashboard.actions';
import { DashboardSelectors } from '../../store/dashboard.selectors';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'pry-manifests',
  templateUrl: './manifests.component.html'
})
export class ManifestsComponent {
  manifests$: Observable<ManifestDescription[]>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  checked: boolean[] = [];

  constructor(protected store: Store<any>) {
    this.store.dispatch(DashboardActions.fetchManifestsList());
    this.manifests$ = this.store
      .select(DashboardSelectors.manifestsList)
      .pipe(
        map((manifestList) => [...manifestList].sort((a, b) => a.modificationDate.localeCompare(b.modificationDate)))
      );
  }

  fetch(id: string) {
    this.store.dispatch(DashboardActions.loadAndActivateManifest({ id }));
  }

  delete(id: string) {
    this.store.dispatch(DashboardActions.deleteManifest({ id }));
  }

  download(id: string, name: string) {
    this.store.dispatch(DashboardActions.downloadManifest({ id, name }));
  }

  handleFileInput(event: Event | null) {
    if (event) {
      const files = (event.currentTarget as HTMLInputElement).files as FileList;
      // @ts-ignore
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          this.store.dispatch(
            DashboardActions.saveManifest({
              id: uuidv4(),
              name: file.name.replace('.json', ''),
              manifest: JSON.parse(evt.target?.result?.toString() ?? '{}')
            })
          );
        };
        reader.readAsText(file, 'UTF-8');
      }
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

}
