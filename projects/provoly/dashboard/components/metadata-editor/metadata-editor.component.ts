import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IMetadata, MetadataUser, MetadataValue, SubscriptionnerDirective } from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { MetadataActions } from './store/metadata.action';
import { MetadataSelectors } from './store/metadata.selector';

export type MetaEventType = { id: string; metadataId: string; value?: string; previousValue?: string };

type GroupedMetadatasByDef = { metadataDef: IMetadata; metadata: (MetadataValue | MetadataUser)[] };

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

  _metadataGroupedByDef$: Observable<GroupedMetadatasByDef[]> = this._metadata$.pipe(
    map((metadatas) => {
      const metadataGroupedByDef: GroupedMetadatasByDef[] = [];
      metadatas.forEach((meta) => {
        const metadataGroup = metadataGroupedByDef.find((val) => val.metadataDef.id === this.metaDefinition(meta).id);
        if (metadataGroup) {
          metadataGroup.metadata.push(meta);
        } else {
          metadataGroupedByDef.push({ metadataDef: this.metaDefinition(meta), metadata: [meta] });
        }
      });
      metadataGroupedByDef.sort((group1, group2) => group1.metadataDef.name.localeCompare(group2.metadataDef.name));
      return metadataGroupedByDef;
    })
  );

  _previousValueMetadata: string | undefined = undefined;

  constructor(
    private store: Store,
    private formBuilder: FormBuilder
  ) {
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
          return userProfileDefs ?? [];
        }
      })
    );

    this.subscriptions.add(
      this.availableMetadata$.subscribe((meta) => {
        this.form.patchValue({
          metadata: meta[0]
        });
        this.onMetaChange(meta[0]);
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
    this.form.patchValue({ value: '' });
    this._previousValueMetadata = undefined;
  }

  editMetadata(currentMetadata: MetadataValue | MetadataUser) {
    this.store.dispatch(MetadataActions.isEditable({ editable: true }));
    let datasetMetadataDef = this.metaDefinition(currentMetadata);
    this.onMetaChange(datasetMetadataDef);

    this.form.patchValue({
      metadata: datasetMetadataDef,
      value: currentMetadata.value
    });
    this._previousValueMetadata = currentMetadata.value;
  }

  metaDefinition(metadata: MetadataUser | MetadataValue) {
    return this._type$.getValue() === 'user'
      ? (metadata as MetadataUser).userProfile
      : (metadata as MetadataValue).metadataDef;
  }

  removeMetadata(metadataDef: IMetadata) {
    this.removeMeta.emit({ id: this.targetId, metadataId: metadataDef.id });
  }

  removeMetadataValue(metadataToRemove: MetadataValue | MetadataUser) {
    // removing one value is like editing current without new value
    this.addMeta.emit({
      id: this.targetId,
      metadataId: this.metaDefinition(metadataToRemove).id,
      value: undefined,
      previousValue: metadataToRemove.value
    });
  }

  addDatasetMetadata() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.isSubmitted = false;
      this.addMeta.emit({
        id: this.targetId,
        metadataId: this.form.value['metadata']['id'],
        value: this.form.value['value'],
        previousValue: this._previousValueMetadata
      });
      this._previousValueMetadata = undefined;
    }
  }
}
