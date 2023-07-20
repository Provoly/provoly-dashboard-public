import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Attribute,
  Class,
  ClassActions,
  ClassSelectors,
  LinkDetails,
  LinkExtended,
  RelationTypesActions
} from '@provoly/dashboard';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { AdminActions } from '../../store/admin.actions';
import { LinksActions } from './store/links.actions';
import { LinksSelectors } from './store/links.selectors';

@Component({
  selector: 'pry-admin-links',
  templateUrl: './admin-links.component.html'
})
export class AdminLinksComponent {
  links$: Observable<LinkDetails[]>;
  linksExtended$: Observable<LinkExtended[]>;

  classes$: Observable<Class[]>;
  sortActive? = 'name';
  sortDirection? = 'asc';

  sub = new Subscription();

  constructor(
    private store: Store<AdminLinksComponent>,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.store.dispatch(LinksActions.loadLinks());
    this.store.dispatch(ClassActions.load());
    this.store.dispatch(RelationTypesActions.load());
    this.links$ = this.store.select(LinksSelectors.links);
    this.classes$ = this.store.select(ClassSelectors.classes);

    const path = this.router.createUrlTree(['.', 'new'], { relativeTo: this.route });
    this.store.dispatch(
      AdminActions.mainActions({
        actions: [
          {
            action: AdminActions.routeTo({ path: path.toString() }),
            label: 'add',
            icon: 'add_column',
            moduleAccess: 'admin',
            pageAccess: 'links',
            actionAccess: 'write'
          }
        ]
      })
    );

    this.linksExtended$ = combineLatest([this.links$, this.classes$]).pipe(
      map(([links, classes]) => {
        return links.map((l) => {
          return {
            id: l.id,
            relationType: l.relationType.name,
            attributeSource: l.attributeSource.name,
            attributeDestination: l.attributeDestination.name,
            classSource:
              classes.find((c) => c.attributes.find((a: Attribute) => a.id === l.attributeSource.id) !== undefined)
                ?.name || '',
            classDestination:
              classes.find((c) => c.attributes.find((a: Attribute) => a.id === l.attributeDestination.id) !== undefined)
                ?.name || ''
          };
        });
      })
    );
  }
}
