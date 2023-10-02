import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IMetadata, MetadataUser, MetadataValue, SubscriptionnerDirective } from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { MetadataActions } from './store/metadata.action';
import { MetadataSelectors } from './store/metadata.selector';

export type MetaEventType = { id: string; metadataId: string; value?: string };

export const INTEGER_REGEXP_PATTERN = '^[+-]?[0-9]*$';
export const DOUBLE_REGEXP_PATTERN = '[+-]?([0-9]*[.])?[0-9]+';
@Component({
  selector: 'pry-metadata-editor',
  templateUrl: 'metadata-editor.component.html'
})
export class PryMetadataEditorComponent extends SubscriptionnerDirective {
  _metadata$ = new BehaviorSubject<(MetadataValue | MetadataUser)[]>([]);
  _initialMetadataSelection$ = new BehaviorSubject<string>('');
  form: FormGroup;
  isSubmitted = false;
  @Input() targetId = '';
  @Input() isModification = false;
  metadataDefs$: Observable<IMetadata[]>;
  availableMetadata$: Observable<IMetadata[]>;
  type: 'meta' | 'user' = 'meta';
  @Output() addMeta = new EventEmitter<MetaEventType>();
  @Output() removeMeta = new EventEmitter<MetaEventType>();

  @Input() set metadata(metadata: MetadataValue[] | MetadataUser[]) {
    // @ts-ignore
    const isUserProfile = metadata.length >= 1 && metadata[0].userProfile !== undefined;
    if (isUserProfile) {
      this.type = 'user';
    } else {
      this.type = 'meta';
    }
    this._metadata$.next(metadata);
  }

  @Input() set initialMetadataSelection(metadataName: string) {
    this._initialMetadataSelection$.next(metadataName);
  }

  constructor(private store: Store, private formBuilder: FormBuilder) {
    super();

    this.form = this.formBuilder.group({
      metadata: [{}, [Validators.required]],
      value: ['', [Validators.required, Validators.pattern(INTEGER_REGEXP_PATTERN)]]
    });

    this.metadataDefs$ = this.store.select(MetadataSelectors.metadata);
    this.availableMetadata$ = combineLatest([this._metadata$, this.metadataDefs$]).pipe(
      map(([metadata, metaDefs]) => {
        let datasetMetadataIds = metadata?.map((u) =>
          this.type === 'meta' ? (u as MetadataValue).metadataDef.id : (u as MetadataUser).userProfile
        );
        return metaDefs.filter((meta) => !datasetMetadataIds?.includes(meta.id));
      })
    );

    this.subscriptions.add(
      combineLatest([
        this.metadataDefs$,
        this.availableMetadata$,
        this._metadata$,
        this._initialMetadataSelection$
      ]).subscribe(([allMeta, availableMeta, inputMeta, initiallySelectedMeta]) => {
        let initiallySelectedMetaAvailable = availableMeta.find((metadata) => metadata.name === initiallySelectedMeta);
        if (!!initiallySelectedMetaAvailable) {
          this.form.patchValue({
            metadata: initiallySelectedMetaAvailable ?? availableMeta[0]
          });
          this.onMetaChange(initiallySelectedMetaAvailable ?? availableMeta[0]);
          this.form.patchValue({ value: '' });
        } else {
          this.store.dispatch(MetadataActions.isEditable({ editable: true }));
          this.form.patchValue({
            metadata: allMeta.find((metadata) => metadata.name === initiallySelectedMeta),
            value: inputMeta.find((meta) => this.metaDefinition(meta).name === initiallySelectedMeta)?.value
          });
        }
      })
    );
  }

  onMetaChange(metadata: IMetadata) {
    if (metadata) {
      if (metadata.type === 'INTEGER') {
        this.form.controls['value'].setValidators([Validators.required, Validators.pattern(INTEGER_REGEXP_PATTERN)]);
      } else if (metadata.type === 'DOUBLE') {
        this.form.controls['value'].setValidators([Validators.required, Validators.pattern(DOUBLE_REGEXP_PATTERN)]);
      } else {
        this.form.controls['value'].setValidators([Validators.required]);
      }
      this.isModification = true;
    } else {
      this.isModification = false;
    }
  }

  editMetadata(currentMetadata: MetadataValue | MetadataUser) {
    this.store.dispatch(MetadataActions.isEditable({ editable: true }));
    let value = currentMetadata.value;
    let datasetMetadataDef = this.metaDefinition(currentMetadata);

    this.form.patchValue({
      metadata: datasetMetadataDef,
      value: value
    });
    this.onMetaChange(datasetMetadataDef);
  }

  metaDefinition(metadata: MetadataUser | MetadataValue) {
    return this.type === 'user' ? (metadata as MetadataUser).userProfile : (metadata as MetadataValue).metadataDef;
  }

  removeMetadata(metadata: MetadataUser | MetadataValue) {
    this.removeMeta.emit({ id: this.targetId, metadataId: this.metaDefinition(metadata).id });
  }

  addDatasetMetadata() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.isSubmitted = false;
      this.addMeta.emit({
        id: this.targetId,
        metadataId: this.form.value['metadata']['id'],
        value: this.form.value['value']
      });
    }
  }
}
