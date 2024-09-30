import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ENV_OPTIONS, Environment } from '@provoly/dashboard';
import { combineLatest, map, Observable, Subject, Subscription } from 'rxjs';
import { AdminActions } from '../../../store/admin.actions';
import { EnvironmentActions } from '../store/environment.actions';
import { EnvironmentSelectors } from '../store/environment.selectors';

@Component({
  selector: 'pry-admin-environment-form',
  templateUrl: './admin-environment-form.component.html'
})
export class AdminEnvironmentFormComponent implements OnInit, OnChanges, OnDestroy {
  envNames$?: Observable<string[]>;
  nameAlreadyExists$?: Observable<boolean>;
  private currentEnv$ = new Subject<Environment>();
  sub = new Subscription();

  _currentEnv?: Environment;
  envForm: UntypedFormGroup;
  envOptions = ENV_OPTIONS;
  currentTypeTranslation = '';
  isSubmitted = false;

  @Input() set currentEnv(val: Environment) {
    this.currentEnv$.next(val);
    this._currentEnv = val;
  }

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe
  ) {
    this.envForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_-]*$')]],
      type: [this.envOptions[0].varType],
      value: ['', [Validators.required, Validators.pattern('^[+-]?[0-9]*$')]]
    });
    this.sub.add(
      this.currentEnv$.subscribe((ce) => {
        this._currentEnv = ce;
        const type = ENV_OPTIONS.find((el) => el.varType === ce?.type);
        this.currentTypeTranslation = type ? type.translation : ENV_OPTIONS[0].translation;
        if (!!this._currentEnv) {
          this.envForm.controls['type'].disable({ onlySelf: true });
        } else {
          this.envForm.controls['type'].enable({ onlySelf: true });
        }
      })
    );
  }

  ngOnInit(): void {
    if (!this._currentEnv) {
      this.store.dispatch(EnvironmentActions.loadEnvironments());
      this.envNames$ = this.store
        .select(EnvironmentSelectors.environments)
        .pipe(map((envs: Environment[]) => envs.map((env: Environment) => env.name.toLowerCase())));

      this.nameAlreadyExists$ = combineLatest([
        this.envForm.get('name')?.valueChanges as Observable<string>,
        this.envNames$
      ]).pipe(map(([value, envNames]) => envNames.includes(value.toLowerCase())));
      this.sub.add(
        this.nameAlreadyExists$.subscribe((value) => {
          if (value) {
            this.envForm.controls['name'].setErrors({ 'same-name': true });
          }
          return value;
        })
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._currentEnv) {
      this.envForm.patchValue({
        name: this._currentEnv.name,
        type: this._currentEnv.type,
        value:
          this._currentEnv.type === 'DATE'
            ? this.datePipe.transform(this._currentEnv.value, 'yyyy-MM-dd')
            : this._currentEnv.value
      });
      this.onTypeChange(this._currentEnv.type);
      this.envForm.controls['name'].disable();
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goBack() {
    this.store.dispatch(AdminActions.routeTo({ path: this.getPath(), params: undefined }));
  }

  addEnvironment() {
    this.isSubmitted = true;
    if (this.envForm.valid) {
      this.isSubmitted = false;
      let newEnv = this.envForm.getRawValue();
      if (newEnv.type === 'INTEGER') {
        newEnv.value = parseInt(newEnv.value);
      } else if (newEnv.type === 'DOUBLE') {
        newEnv.value = parseFloat(newEnv.value);
      } else if (newEnv.type === 'DATE') {
        newEnv.value = this.datePipe.transform(newEnv.value, 'yyyy/MM/dd');
      }
      this.store.dispatch(EnvironmentActions.saveEnvironment({ env: newEnv, route: this.getPath() }));
    }
  }

  onTypeChange(type: string) {
    if (type === 'INTEGER') {
      this.envForm.controls['value'].setValidators([Validators.required, Validators.pattern('^[+-]?[0-9]*$')]);
    } else if (type === 'DOUBLE') {
      this.envForm.controls['value'].setValidators([
        Validators.required,
        Validators.pattern('[+-]?([0-9]*[.])?[0-9]+')
      ]);
    } else {
      this.envForm.controls['value'].setValidators([Validators.required]);
    }
  }

  getPath() {
    let path = this.router.createUrlTree(['..'], { relativeTo: this.route });
    if (this._currentEnv) {
      path = this.router.createUrlTree(['../..'], { relativeTo: this.route });
    }
    return path.toString();
  }
}
