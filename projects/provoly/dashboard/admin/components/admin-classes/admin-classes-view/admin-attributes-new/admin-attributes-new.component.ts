import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Class, ClassActions, ClassSelectors } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { AdminClassSelectors } from '../../store/admin-class.selectors';

@Component({
  selector: 'pry-admin-attributes-new',
  templateUrl: './admin-attributes-new.component.html'
})
export class AdminAttributesNewComponent implements OnInit {
  selectedClass$?: Observable<Class>;
  interClass$?: Observable<Class | undefined>;

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
      this.interClass$ = this.store.select(AdminClassSelectors.interClass);
    });
  }
}
