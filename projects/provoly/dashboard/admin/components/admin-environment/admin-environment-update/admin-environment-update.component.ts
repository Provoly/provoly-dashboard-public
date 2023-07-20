import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Environment } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { EnvironmentActions } from '../store/environment.actions';
import { EnvironmentSelectors } from '../store/environment.selectors';

@Component({
  selector: 'pry-admin-environment-update',
  templateUrl: './admin-environment-update.component.html'
})
export class AdminEnvironmentUpdateComponent implements OnInit {
  currentEnv$: Observable<Environment | undefined>;

  constructor(
    private store: Store<any>,
    private route: ActivatedRoute
  ) {
    this.currentEnv$ = this.store.select(EnvironmentSelectors.currentEnv);
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) =>
      this.store.dispatch(EnvironmentActions.selectEnvironment({ name: params['name'] }))
    );
  }
}
