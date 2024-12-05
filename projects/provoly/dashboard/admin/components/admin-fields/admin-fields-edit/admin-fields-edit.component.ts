import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Field, FieldActions, FieldSelectors } from '@provoly/dashboard';
import { Observable } from 'rxjs';

@Component({
  selector: 'pry-admin-fields-edit',
  templateUrl: './admin-fields-edit.component.html'
})
export class AdminFieldsEditComponent implements OnInit {
  currentField$?: Observable<Field | undefined>;

  constructor(
    private store: Store<any>,
    private route: ActivatedRoute
  ) {
    this.store.dispatch(FieldActions.load({}));
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params) => (this.currentField$ = this.store.select(FieldSelectors.fieldById(params['id'])))
    );
  }
}
