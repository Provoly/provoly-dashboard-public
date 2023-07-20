import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  Attribute,
  Class,
  ClassActions,
  ClassSelectors,
  Link,
  LinkDetails,
  RelationType,
  RelationTypesActions,
  RelationTypesSelectors
} from '@provoly/dashboard';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { AdminActions } from '../../../store/admin.actions';
import { LinksActions } from '../store/links.actions';
import { LinksSelectors } from '../store/links.selectors';

@Component({
  selector: 'pry-admin-links-new',
  templateUrl: './admin-links-new.component.html'
})
export class AdminLinksNewComponent {
  sub = new Subscription();

  sortActive? = 'name';
  sortDirection? = 'asc';

  relationTypes$: Observable<RelationType[]>;
  links$: Observable<LinkDetails[]>;
  classes$: Observable<Class[]>;
  attributesSource$?: Observable<Attribute[] | undefined>;
  attributesDestination$?: Observable<Attribute[] | undefined>;
  attrIdTofilter$?: Observable<string[]>;

  linkForm: UntypedFormGroup;

  classSourceId?: string;
  isSubmitted = false;
  isSelectClass = false;

  constructor(
    private store: Store<AdminLinksNewComponent>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder
  ) {
    this.store.dispatch(ClassActions.load());
    this.store.dispatch(RelationTypesActions.load());
    this.store.dispatch(LinksActions.loadLinks());
    this.classes$ = this.store.select(ClassSelectors.classes);
    this.relationTypes$ = this.store.select(RelationTypesSelectors.relationsTypes);
    this.links$ = this.store.select(LinksSelectors.links);
    this.linkForm = this.formBuilder.group({
      id: [uuid()],
      relationType: ['', [Validators.required]],
      classSource: [undefined, [Validators.required]],
      attributeSource: [undefined, [Validators.required]],
      classDestination: [undefined, [Validators.required]],
      attributeDestination: [undefined, [Validators.required]]
    });
  }

  onTypeSourceChange() {
    this.isSelectClass = this.linkForm.get('relationType')?.value !== undefined;
  }

  onClassSourceChange(event: any) {
    this.linkForm.patchValue({
      attributeSource: '',
      classDestination: '',
      attributeDestination: ''
    });
    this.attributesSource$ = this.classes$.pipe(map((classes) => classes.find((c) => c.id === event.id)?.attributes));
    this.classSourceId = event.id;
  }

  onClassDestinationChange(event: any) {
    this.linkForm.patchValue({
      attributeDestination: ''
    });

    this.attrIdTofilter$ = this.links$.pipe(
      map((links) =>
        links
          .filter(
            (link) =>
              link.attributeSource.id == this.linkForm.value.attributeSource.id ||
              link.attributeDestination.id == this.linkForm.value.attributeSource.id
          )
          .map((item) =>
            item.attributeSource.id === this.linkForm.value.attributeSource.id
              ? item.attributeDestination.id
              : item.attributeSource.id
          )
      )
    );

    this.attributesDestination$ = combineLatest([this.classes$, this.attrIdTofilter$]).pipe(
      map(
        ([classes, attrIds]) =>
          classes
            .find((c) => c.id === event.id)
            ?.attributes.filter(
              (attr) => !attrIds.includes(attr.id) && this.linkForm.value.attributeSource.id !== attr.id
            )
      )
    );
  }

  goBack() {
    let path = this.router.createUrlTree(['..'], { relativeTo: this.route });
    this.store.dispatch(AdminActions.routeTo({ path: path.toString() }));
  }

  addLink() {
    this.isSubmitted = true;
    if (this.linkForm.valid) {
      this.isSubmitted = false;
      let linkToAdd = {
        id: this.linkForm.value.id,
        relationType: this.linkForm.value.relationType,
        attributeSource: this.linkForm.value.attributeSource.id,
        attributeDestination: this.linkForm.value.attributeDestination.id
      } as Link;

      let path = this.router.createUrlTree(['..'], { relativeTo: this.route });
      this.store.dispatch(LinksActions.saveLink({ link: linkToAdd, route: path.toString() }));
    }
  }
}
