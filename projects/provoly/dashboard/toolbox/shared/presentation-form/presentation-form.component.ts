import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  DEFAULT_DASHBOARD_ICON_URL,
  LibraryTypes,
  ManifestDescription,
  SubscriptionnerDirective
} from '@provoly/dashboard';
import { AfterViewInit, Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MetadataActions, MetadataSelectors } from '@provoly/dashboard/components/metadata-editor';
import { Store } from '@ngrx/store';

export interface PresentationForm {
  name: FormControl<string | undefined>;
  description: FormControl<string | undefined | null>;
  theme: FormControl<string | undefined | null>;
  additionalInformation: FormControl<string | undefined | null>;
}

export interface PresentationFormValue {
  name: string;
  description?: string;
  theme?: string;
  additionalInformation?: string;
  image: string;
}

@Component({
  selector: 'pry-presentation-form',
  templateUrl: './presentation-form.component.html'
})
export class PresentationFormComponent extends SubscriptionnerDirective implements OnInit, AfterViewInit {
  form = new FormGroup<PresentationForm>({
    name: new FormControl(undefined, {
      validators: [Validators.required, Validators.maxLength(50)],
      nonNullable: true
    }),
    description: new FormControl(undefined, [Validators.maxLength(200)]),
    theme: new FormControl(undefined),
    additionalInformation: new FormControl(undefined)
  });

  image: string = DEFAULT_DASHBOARD_ICON_URL;
  type: LibraryTypes = LibraryTypes.ILLUSTRATION;
  possibleThemes: string[] = [];

  @Input() mode: 'theme' | 'meta' = 'meta';
  @Input() themePrefix: string | null = null;
  @ViewChild('input') input!: ElementRef;

  selectedPresentation$ = new BehaviorSubject<ManifestDescription | undefined>(undefined);

  @Input() set selectedPresentation(presentation: ManifestDescription | undefined) {
    this.selectedPresentation$.next(presentation);
  }

  @Output() formValue = new BehaviorSubject<Partial<PresentationFormValue> | undefined>(undefined);
  @Output() isFormValid = new BehaviorSubject<boolean>(false);

  constructor(protected store: Store) {
    super();
    this.store.dispatch(MetadataActions.loadMetadata());

    this.subscriptions.add(
      this.store.select(MetadataSelectors.metadata).subscribe((metadata) => {
        this.possibleThemes = metadata?.find((meta) => meta.name === '_theme')?.allowedValues ?? [];
      })
    );

    this.subscriptions.add(
      this.form.valueChanges.subscribe(() => {
        this.isFormValid.next(this.form.valid);
        this.formValue.next(this.getFormValue());
      })
    );
  }

  ngOnInit(): void {
    this.image = this.selectedPresentation$.value?.image ?? DEFAULT_DASHBOARD_ICON_URL;
    this.subscriptions.add(
      this.selectedPresentation$.subscribe((presentation) => {
        const theme = presentation?.metadata?.find((metadata) => metadata.metadataDef.name === '_theme')?.value;
        if (!!theme) this.form.patchValue({ theme });
      })
    );
    setTimeout(() => {
      this.input?.nativeElement.focus();
    }, 10);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.selectedPresentation$.value) this.form.patchValue(this.selectedPresentation$.value);
    });
  }

  get name(): AbstractControl<string | undefined> {
    return this.form.controls['name'];
  }

  get description(): AbstractControl<string | undefined | null> {
    return this.form.controls['description'];
  }

  get theme(): AbstractControl<string | undefined | null> {
    return this.form.controls['theme'];
  }

  get additionalInformation(): AbstractControl<string | undefined | null> {
    return this.form.controls['additionalInformation'];
  }

  getFormValue(): Partial<PresentationFormValue> {
    return {
      name: this.name.value,
      description: this.description.value === null ? undefined : this.description.value,
      theme: this.theme.value === null ? undefined : this.theme.value,
      additionalInformation: this.additionalInformation.value === null ? undefined : this.additionalInformation.value,
      image: this.image
    };
  }
}
