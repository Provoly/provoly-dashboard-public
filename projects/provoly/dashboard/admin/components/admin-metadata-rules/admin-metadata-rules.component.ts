import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { META_OPTIONS, MetadataRules, PryI18nService } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { AdminActions } from '../../store/admin.actions';
import { IConfigHeader } from '../admin-metadata/shared/list-metadata/pry-list-metadata.component';
import { AdminMetadataRulesActions } from './store/metadata-rules.actions';
import { MetadataRulesState } from './store/metadata-rules.reducer';
import { MetadataRulesSelectors } from './store/metadata-rules.selectors';

@Component({
  selector: 'pry-admin-metadata-rules',
  templateUrl: './admin-metadata-rules.component.html'
})
export class AdminMetadataRulesComponent {
  @ViewChild('input') input!: ElementRef;

  metadataRulesList$: Observable<MetadataRules[]>;

  selectedMetadataRules$: Observable<string | undefined>;

  sortActive? = 'name';

  sortDirection? = 'asc';

  value: string = '';

  configHeader: Array<IConfigHeader>;

  labelMetadataSelected: string = '';

  editOpened: boolean = false;

  validateAction: () => void;
  cancelAction: () => void;

  constructor(
    private store: Store<MetadataRulesState>,
    private translateService: PryI18nService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.validateAction = () => this.validateName(this.labelMetadataSelected);
    this.cancelAction = () => this.cancelEdition();
    this.configHeader = [
      { headerType: 'label', label: this.translateService.instant('@pry.admin.metadata-rules.label') },
      { headerType: 'label', label: this.translateService.instant('@pry.admin.metadata-rules.metadata-item.name') },
      { headerType: 'label', label: this.translateService.instant('@pry.admin.metadata-rules.metadata-user.name') }
    ];
    this.store.dispatch(AdminMetadataRulesActions.load());
    this.metadataRulesList$ = this.store.select(MetadataRulesSelectors.metadataRulesList);
    this.selectedMetadataRules$ = this.store.select(MetadataRulesSelectors.metadataRulesSelectedId);
    this.store.dispatch(AdminMetadataRulesActions.unselectMetadata());
    const path = this.router.createUrlTree(['new'], { relativeTo: this.route });
    this.store.dispatch(
      AdminActions.mainActions({
        actions: [
          {
            action: AdminMetadataRulesActions.openNewMetadataRules({ route: path.toString() }),
            label: 'add',
            icon: 'add_column',
            moduleAccess: 'admin',
            pageAccess: 'metadata_rules',
            actionAccess: 'write'
          }
        ]
      })
    );
  }

  cancelEdition(): void {
    this.toggleEditionMetadata();
    this.store.dispatch(AdminMetadataRulesActions.unselectMetadata());
  }

  toggleEditionMetadata(): void {
    this.editOpened = !this.editOpened;
    if (this.editOpened) {
      setTimeout(() => {
        this.input.nativeElement.focus();
      }, 10);
    }
  }

  validateName(newLabel: string): void {
    this.toggleEditionMetadata();
  }

  changeValue($event: any) {
    this.labelMetadataSelected = $event;
  }

  selectMetadata(metadataRules: MetadataRules) {
    this.openDetail(metadataRules);
  }

  openDetail(metadataRules: MetadataRules) {
    this.store.dispatch(AdminMetadataRulesActions.selectMetadata({ metadataRules }));
    this.store.dispatch(AdminActions.selectComponentType({ componentType: 'AdminSelectMetadataRulesComponent' }));
  }

  getTranslationType(type: string) {
    return META_OPTIONS.find((el) => el.varType === type)?.translation || 'undefined';
  }
}
