import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { IMetadata, MetadataRules } from '@provoly/dashboard';
import { Observable, Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AdminActions } from '../../../../store/admin.actions';
import { AdminMetadataUserActions } from '../../../admin-metadata-user/store/admin-metadata-user.action';
import { AdminMetadataUserState } from '../../../admin-metadata-user/store/admin-metadata-user.reducer';
import { AdminMetadataUserSelectors } from '../../../admin-metadata-user/store/admin-metadata-user.selector';
import { MetadataActions } from '../../../admin-metadata/store/metadata.action';
import { MetadataState } from '../../../admin-metadata/store/metadata.reducer';
import { MetadataSelectors } from '../../../admin-metadata/store/metadata.selector';
import { AdminMetadataRulesActions } from '../../store/metadata-rules.actions';
import { MetadataRulesState } from '../../store/metadata-rules.reducer';
import { MetadataRulesSelectors } from '../../store/metadata-rules.selectors';

@Component({
  selector: 'pry-admin-form-metadata-rules',
  templateUrl: './admin-form-metadata-rules.component.html'
})
export class AdminFormMetadataRulesComponent implements OnInit, OnDestroy {
  @Input() metadataRules?: MetadataRules | null;

  metadataList$: Observable<IMetadata[]>;
  metadataUserList$: Observable<IMetadata[]>;
  metadataRulesList$: Observable<MetadataRules[]>;

  metadataList: IMetadata[] = [];
  metadataUserList: IMetadata[] = [];
  metadataUserListFilter: IMetadata[] = [];
  metadataRulesList: MetadataRules[] = [];

  sub = new Subscription();

  form: UntypedFormGroup;

  isSameName = false;
  isSameRules = false;

  isSubmitted = false;

  constructor(
    private store: Store<MetadataRulesState | MetadataState | AdminMetadataUserState>,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder
  ) {
    this.metadataList$ = this.store.select(MetadataSelectors.metadata);
    this.metadataUserList$ = this.store.select(AdminMetadataUserSelectors.metadata);
    this.metadataRulesList$ = this.store.select(MetadataRulesSelectors.metadataRulesList);
    this.form = this.formBuilder.group({
      id: [uuidv4()],
      name: ['', [Validators.required]],
      metadataUser: ['', [Validators.required]],
      metadataItem: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.isSameRules = false;
    this.isSameName = false;
    this.store.dispatch(AdminMetadataRulesActions.load());
    this.store.dispatch(MetadataActions.loadMetadata());
    this.store.dispatch(AdminMetadataUserActions.loadMetadata());
    this.sub = this.metadataList$.subscribe((metadataList) => {
      this.metadataList = metadataList;
    });
    this.sub.add(
      this.metadataRulesList$.subscribe((metadataRulesList) => {
        this.metadataRulesList = metadataRulesList;
      })
    );
    this.sub.add(
      this.metadataUserList$.subscribe((metadataUserList) => {
        this.metadataUserList = metadataUserList;
        this.metadataUserListFilter = metadataUserList;
        if (this.metadataList.length > 0) {
          this.form.patchValue({ metadataItem: this.metadataList[0].id });
          this.selectMetadataItem(this.metadataList[0].id);
        }
        if (this.metadataRules) {
          this.metadataRulesList = this.metadataRulesList.filter((meta) => meta.id !== this.metadataRules?.id);
          const { id, name, userProfile, metadata } = this.metadataRules;
          this.form.patchValue({
            id,
            name,
            metadataUser: userProfile.id,
            metadataItem: metadata.id
          });
        }
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goBack() {
    this.store.dispatch(AdminActions.routeTo({ path: this.getPath() }));
  }

  getPath() {
    let path = this.router.createUrlTree(['..'], { relativeTo: this.route });
    if (this.metadataRules) {
      path = this.router.createUrlTree(['../..'], { relativeTo: this.route });
    }
    return path.toString();
  }

  selectMetadataItem(id: string) {
    this.isSameRules = false;
    const metadata = this.metadataList.find((m) => id === m.id);
    if (metadata) {
      this.metadataUserListFilter = this.metadataUserList.filter((mU) => mU.type === metadata.type);
    }
    this.selectAutoMetadataUser();
  }

  selectAutoMetadataUser() {
    this.form.patchValue({
      userProfil:
        this.metadataUserListFilter.length > 0
          ? this.metadataRules?.userProfile?.id &&
            !!this.metadataUserListFilter.find((metadata) => metadata.id === this.metadataRules?.userProfile?.id)
            ? this.metadataRules.userProfile.id
            : this.metadataUserListFilter[0].id
          : ''
    });
  }

  selectMetadataUser(id: string) {
    this.isSameRules = false;
  }

  changeValueName(value: string) {
    this.isSameName = false;
  }

  submit() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.isSubmitted = false;
      this.isSameName = !!this.metadataRulesList.find(
        (metadata) => this.form.get('name')?.value.toLowerCase() === metadata.name.toLowerCase()
      );
      this.isSameRules = !!this.metadataRulesList.find((metadata) => {
        return (
          this.form.get('metadataUser')?.value === metadata?.userProfile?.id &&
          this.form.get('metadataItem')?.value === metadata?.metadata?.id
        );
      });
      if (this.form.valid && !this.isSameName && !this.isSameRules) {
        this.store.dispatch(AdminMetadataRulesActions.post({ metadata: this.form.value }));
      }
    }
  }
}
