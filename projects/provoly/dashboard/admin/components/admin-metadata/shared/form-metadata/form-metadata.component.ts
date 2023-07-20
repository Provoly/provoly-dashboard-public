import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IMetadata, META_OPTIONS } from '@provoly/dashboard';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { AdminActions } from '../../../../store/admin.actions';
import { AdminMetadataUserSelectors } from '../../../admin-metadata-user/store/admin-metadata-user.selector';
import { MetadataSelectors } from '../../store/metadata.selector';

@Component({
  selector: 'pry-form-metadata',
  templateUrl: './form-metadata.component.html'
})
export class FormMetadataComponent implements OnInit, OnDestroy {
  metaForm: UntypedFormGroup;
  metaOptions = META_OPTIONS;
  currentTypeTranslation = '';

  metadataNames$?: Observable<string[]>;
  nameAlreadyExists$?: Observable<boolean>;

  sub = new Subscription();

  isSubmitted = false;

  @Input() titleForm: string = '';
  @Input() isMetaSimpleEdit = false;
  @Input() isMetaUser = false;
  @Input() metadata?: IMetadata;

  @Output() submitMetadata$: EventEmitter<IMetadata> = new EventEmitter<IMetadata>();

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder
  ) {
    this.metaForm = this.formBuilder.group({
      id: [{ value: uuid(), disabled: true }],
      name: ['', [Validators.required]],
      type: [this.metaOptions[0].varType],
      description: [],
      allowedValues: this.formBuilder.array([])
    });
  }

  ngOnInit(): void {
    if (this.isMetaUser) {
      this.metadataNames$ = this.store
        .select(AdminMetadataUserSelectors.metadata)
        .pipe(map((metadata) => metadata.map((metadata) => metadata.name.toLowerCase())));
    } else {
      this.metadataNames$ = this.store
        .select(MetadataSelectors.metadata)
        .pipe(map((metadata) => metadata.map((metadata: IMetadata) => metadata.name.toLowerCase())));
    }

    this.nameAlreadyExists$ = combineLatest([
      this.metaForm.get('name')?.valueChanges as Observable<string>,
      this.metadataNames$
    ]).pipe(map(([value, metaNames]) => metaNames.includes(value.toLowerCase()) && value != this.metadata?.name));
    this.sub.add(
      this.nameAlreadyExists$.subscribe((value) => {
        if (value) {
          this.metaForm.controls['name'].setErrors({ 'same-name': true });
        }
        return value;
      })
    );

    if (this.metadata) {
      const type = META_OPTIONS.find((el) => el.varType === this.metadata?.type);
      this.currentTypeTranslation = type ? type.translation : META_OPTIONS[0].translation;
      this.metaForm.patchValue({
        id: this.metadata.id,
        name: this.metadata.name,
        type: this.metadata.type,
        description: this.metadata.description
      });
      if (this.isMetaSimpleEdit) {
        this.metaForm.controls['name'].disable();
      }

      if (this.metadata.allowedValues) {
        for (let item of this.metadata.allowedValues) {
          this.metadataList.push(new UntypedFormControl({ value: item, disabled: true }));
        }
      }
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  get metadataList() {
    return this.metaForm.controls['allowedValues'] as UntypedFormArray;
  }

  addMetadata() {
    this.isSubmitted = true;
    if (this.metaForm.valid) {
      this.isSubmitted = false;
      let payload = {
        ...this.metaForm.getRawValue(),
        allowedValues: this.metaForm.getRawValue().allowedValues.filter((x: string) => x !== null)
      };
      this.submitMetadata$.emit(payload);
      this.goBack();
    }
  }

  addItemList(type?: string) {
    if (type === 'LIST' || type === undefined) {
      this.metadataList.push(new UntypedFormControl('', Validators.required));
    }
  }

  removeItemList(index: number) {
    this.metadataList.removeAt(index);
  }

  goBack() {
    this.store.dispatch(AdminActions.routeTo({ path: this.getPath() }));
  }

  getPath() {
    let path = this.router.createUrlTree(['..'], { relativeTo: this.route });
    if (this.metadata) {
      path = this.router.createUrlTree(['../..'], { relativeTo: this.route });
    }
    return path.toString();
  }
}
