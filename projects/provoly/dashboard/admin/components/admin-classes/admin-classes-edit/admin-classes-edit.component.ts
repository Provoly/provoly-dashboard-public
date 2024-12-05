import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Class, ClassActions, ClassSelectors } from '@provoly/dashboard';
import { Observable } from 'rxjs';

@Component({
  selector: 'pry-admin-classes-edit',
  templateUrl: './admin-classes-edit.component.html'
})
export class AdminClassesEditComponent implements OnInit {
  currentClass$?: Observable<Class | undefined>;

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.store.dispatch(ClassActions.load({}));
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params) => (this.currentClass$ = this.store.select(ClassSelectors.classById(params['id'])))
    );
  }
}
