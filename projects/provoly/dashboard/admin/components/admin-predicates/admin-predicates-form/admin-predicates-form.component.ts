import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Predicate } from '@provoly/dashboard';
import { combineLatest, map, Observable, of, Subscription } from 'rxjs';
import { v4 } from 'uuid';
import { AdminActions } from '../../../store/admin.actions';
import { AbacRulesActions } from '../../admin-abac-rules/store/abac-rules.actions';
import { AbacRule } from '../../admin-abac-rules/store/abac-rules.model';
import { AbacRulesSelectors } from '../../admin-abac-rules/store/abac-rules.selectors';
import { PredicatesActions } from '../store/predicates.actions';
import { PredicatesSelectors } from '../store/predicates.selectors';

@Component({
  selector: 'pry-admin-predicates-form',
  templateUrl: './admin-predicates-form.component.html'
})
export class AdminPredicatesFormComponent implements OnChanges, OnDestroy {
  private rules$: Observable<AbacRule[]>;
  predicatesUsed$: Observable<number> = of(0);
  predicateNames$?: Observable<string[]>;
  nameAlreadyExists$?: Observable<boolean>;

  sub = new Subscription();
  _currentPred?: Predicate;
  predForm: UntypedFormGroup;
  openedModal = false;
  isSubmitted = false;
  validateAction: () => void;
  cancelAction: () => void;

  @Input() set currentPred(val: Predicate) {
    this._currentPred = val;
  }

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder
  ) {
    this.store.dispatch(AbacRulesActions.loadAbacRules());
    this.rules$ = this.store.select(AbacRulesSelectors.abacRules);

    this.validateAction = () => this.addPredicate();
    this.cancelAction = () => this.goBack();

    this.predForm = this.formBuilder.group({
      id: [{ value: v4(), disabled: true }, Validators.required],
      name: ['', [Validators.required]],
      value: ['', [Validators.required]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.predicateNames$ = this.store
      .select(PredicatesSelectors.predicates)
      .pipe(map((predicates) => predicates.map((predicate) => predicate.name.toLowerCase())));

    this.nameAlreadyExists$ = combineLatest([
      this.predForm.get('name')?.valueChanges as Observable<string>,
      this.predicateNames$
    ]).pipe(
      map(([value, predicateNames]) => predicateNames.includes(value.toLowerCase()) && value != this._currentPred?.name)
    );
    this.sub.add(
      this.nameAlreadyExists$.subscribe((value) => {
        if (value) {
          this.predForm.controls['name'].setErrors({ 'same-name': true });
        }
        return value;
      })
    );

    if (!this._currentPred) {
      this.predForm.patchValue({
        id: v4()
      });
    } else if (this._currentPred) {
      this.predicatesUsed$ = this.rules$.pipe(
        map((rules) => rules.filter((rule) => rule.predicate === this._currentPred?.id).length)
      );
      this.predForm.patchValue({
        id: this._currentPred.id,
        name: this._currentPred.name,
        value: this._currentPred.value
      });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goBack() {
    this.store.dispatch(AdminActions.routeTo({ path: this.getPath() }));
  }

  addPredicate() {
    this.isSubmitted = true;
    if (this.predForm.valid) {
      this.isSubmitted = false;
      this.store.dispatch(
        PredicatesActions.savePredicate({ predicate: this.predForm.getRawValue(), route: this.getPath() })
      );
    }
  }

  checkModal() {
    this.sub.add(this.predicatesUsed$.subscribe((used) => (this.openedModal = used > 0)));
    if (!this.openedModal) {
      this.addPredicate();
    }
  }

  getPath() {
    let path = this.router.createUrlTree(['..'], { relativeTo: this.route });
    if (this._currentPred) {
      path = this.router.createUrlTree(['../..'], { relativeTo: this.route });
    }
    return path.toString();
  }
}
