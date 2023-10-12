import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Class, ClassActions, ClassSelectors, SubscriptionnerDirective } from '@provoly/dashboard';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { noWhitespaceValidator } from '../../../components/admin.component';
import { AdminClassActions } from '../store/admin-class.actions';
import { AdminClassSelectors } from '../store/admin-class.selectors';

@Component({
  selector: 'pry-admin-classes-form',
  templateUrl: './admin-classes-form.component.html'
})
export class AdminClassesFormComponent extends SubscriptionnerDirective implements OnInit, OnDestroy {
  classNames$?: Observable<string[]>;
  nameAlreadyExists$?: Observable<boolean>;
  storageOptions$: Observable<string[]>;

  sub = new Subscription();

  isSubmitted = false;
  classForm: UntypedFormGroup;
  _currentClass?: Class;

  @Input() set currentClass(val: Class) {
    this._currentClass = val;
  }

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder
  ) {
    super();
    this.classForm = this.formBuilder.group({
      id: [uuid()],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), noWhitespaceValidator]],
      description: [{ value: '', disabled: true }],
      storage: ['ELASTIC']
    });
    this.store.dispatch(AdminClassActions.getStorageOptions());
    this.storageOptions$ = this.store.select(AdminClassSelectors.storageOptions);
  }

  ngOnInit(): void {
    this.store.dispatch(ClassActions.load());
    this.classNames$ = this.store
      .select(ClassSelectors.classes)
      .pipe(map((classes: Class[]) => classes.map((clazz: Class) => clazz.name.toLowerCase())));
    this.nameAlreadyExists$ = combineLatest([
      this.classForm.get('name')?.valueChanges as Observable<string>,
      this.classNames$
    ]).pipe(
      map(([value, classNames]) => classNames.includes(value.toLowerCase()) && value != this._currentClass?.name)
    );
    this.subscriptions.add(
      this.nameAlreadyExists$.subscribe((value) => {
        if (value) {
          this.classForm.controls['name'].setErrors({ 'same-name': true });
        }
        return value;
      })
    );

    if (this._currentClass) {
      this.classForm.patchValue({
        id: this._currentClass.id,
        name: this._currentClass.name
      });
    }
  }

  goBack() {
    const redirectPath = this._currentClass ? '../..' : '..';
    const path = this.router.createUrlTree([redirectPath], { relativeTo: this.route });
    this.store.dispatch(AdminClassActions.back({ path: path.toString() }));
  }

  addClass() {
    this.classForm.patchValue({
      name: this.classForm.value.name.trim()
    });
    this.isSubmitted = true;
    if (this.classForm.valid) {
      this.isSubmitted = false;
      let classToSave = this.classForm.getRawValue();
      if (this._currentClass) {
        classToSave = {
          ...this._currentClass,
          name: this.classForm.value.name
        } as Class;
        let path = this.router.createUrlTree(['../..'], { relativeTo: this.route });
        this.store.dispatch(AdminClassActions.saveClass({ class: classToSave, route: path.toString() }));
      } else {
        classToSave.attributes = [];
        let path = this.router.createUrlTree(['..', classToSave.id], { relativeTo: this.route });
        this.store.dispatch(AdminClassActions.saveInterClass({ class: classToSave, route: path.toString() }));
      }
    }
  }
}
