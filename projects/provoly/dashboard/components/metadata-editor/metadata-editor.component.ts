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
  form: FormGroup;
  isSubmitted = false;
  @Input() isModification = false;
  metadataDefs$: Observable<IMetadata[]>;
  availableMetadata$: Observable<IMetadata[]>;
  _type$ = new BehaviorSubject<'meta' | 'user'>('meta');
  @Output() addMeta = new EventEmitter<MetaEventType>();
  @Output() removeMeta = new EventEmitter<MetaEventType>();
  userProfileDefs$: Observable<Array<IMetadata> | undefined>;
  @Input() targetId = '';

  @Input() set type(type: 'meta' | 'user') {
    this._type$.next(type);
  }

  @Input() set metadata(metadata: MetadataValue[] | MetadataUser[]) {
    this._metadata$.next(metadata);
  }

  constructor(private store: Store, private formBuilder: FormBuilder) {
    super();

    this.form = this.formBuilder.group({
      metadata: [{}, [Validators.required]],
      value: ['', [Validators.required, Validators.pattern(INTEGER_REGEXP_PATTERN)]]
    });

    this.metadataDefs$ = this.store.select(MetadataSelectors.metadata);
    this.userProfileDefs$ = this.store.select(MetadataSelectors.userProfile);
    this.availableMetadata$ = combineLatest([
      this._type$,
      this._metadata$,
      this.metadataDefs$,
      this.userProfileDefs$
    ]).pipe(
      map(([type, metadata, metaDefs, userProfileDefs]) => {
        if (type === 'meta') {
          let datasetMetadataIds = metadata?.map((u) => (u as MetadataValue).metadataDef.id);
          return metaDefs.filter((meta) => !datasetMetadataIds?.includes(meta.id) && !meta.readOnly);
        } else {
          let userProfileIds = metadata?.map((u) => (u as MetadataUser).userProfile.id);
          return (userProfileDefs ?? []).filter((meta) => !userProfileIds?.includes(meta.id));
        }
      })
    );

    this.subscriptions.add(
      this.availableMetadata$.subscribe((meta) => {
        this.form.patchValue({
          metadata: meta[0]
        });
        this.onMetaChange(meta[0]);
        this.form.patchValue({ value: '' });
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
    return this._type$.getValue() === 'user'
      ? (metadata as MetadataUser).userProfile
      : (metadata as MetadataValue).metadataDef;
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
