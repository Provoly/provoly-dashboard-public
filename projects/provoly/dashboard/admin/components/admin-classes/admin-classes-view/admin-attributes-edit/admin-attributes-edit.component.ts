import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Attribute, Class, ClassActions, ClassSelectors } from '@provoly/dashboard';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'pry-admin-attributes-edit',
  templateUrl: './admin-attributes-edit.component.html'
})
export class AdminAttributesEditComponent implements OnInit {
  selectedClass$?: Observable<Class>;
  selectedAttribute$?: Observable<Attribute | undefined>;

  constructor(
    private store: Store<any>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.store.dispatch(ClassActions.load());
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.selectedClass$ = this.store.select(ClassSelectors.classById(params['id']));
      this.selectedAttribute$ = this.selectedClass$.pipe(
        map((selectedClass) => selectedClass.attributes.find((attr) => attr.id == params['attrId']))
      );
    });
  }
}
