import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DatasourceUtils, NamedQuery, NamedQueryTypes, PryDialogService } from '@provoly/dashboard';
import { SearchFulltextChange } from '../../search-fulltext/search-fulltext/search-fulltext.component';
import { PrySaveQueryComponent } from '../save-query/save-query.component';

@Component({
  selector: 'pry-save-query-button',
  templateUrl: './save-query-button.component.html'
})
export class PrySaveQueryButtonComponent implements OnChanges {
  @Input() editInProgress: boolean | null = false;
  @Input() currentEdit?: NamedQuery | null;
  @Input() currentEditType?: NamedQueryTypes | null;
  @Input() fulltextValid: boolean | null = false;
  @Input() multiValid: boolean | null = false;
  @Input() monoValid: boolean | null = false;
  @Input() isNotFulltext = false;
  @Input() isMonoSearch = false;
  @Input() fulltextSearch?: SearchFulltextChange;
  @Input() saveDisabled = true;

  constructor(private pryDialog: PryDialogService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const isEditFulltextValid =
      this.editInProgress && this.currentEditType === NamedQueryTypes.FULL_TEXT && this.fulltextValid;
    const isEditMonoValid =
      this.editInProgress && this.currentEditType === NamedQueryTypes.MONO_CLASS && this.monoValid;
    const isEditMultiValid =
      this.editInProgress && this.currentEditType === NamedQueryTypes.MULTI_CLASS && this.multiValid;
    const isCreateFulltextValid = !this.editInProgress && !this.isNotFulltext && this.fulltextValid;
    const isCreateMonoValid = !this.editInProgress && this.isNotFulltext && this.isMonoSearch && this.monoValid;
    const isCreateMultiValid = !this.editInProgress && this.isNotFulltext && !this.isMonoSearch && this.multiValid;
    this.saveDisabled =
      //test pour rendre inactive la sauvegarde via l'edition
      //!isEditFulltextValid &&
      //!isEditMonoValid &&
      //!isEditMultiValid &&
      !isCreateFulltextValid && !isCreateMonoValid && !isCreateMultiValid;
  }

  openSaveQuery() {
    if (!this.saveDisabled) {
      const save = true;
      const nq = this.currentEdit;
      const type = nq
        ? DatasourceUtils.getTypeFromPayload(nq.request)
        : this.getNQType(this.isNotFulltext, this.isMonoSearch);
      const data = type === NamedQueryTypes.FULL_TEXT ? { save, type, payload: this.fulltextSearch } : { save, type };
      this.pryDialog.open(PrySaveQueryComponent, { data });
    }
  }

  private getNQType(isNotFulltext: boolean, isMono: boolean): NamedQueryTypes {
    return isNotFulltext
      ? isMono
        ? NamedQueryTypes.MONO_CLASS
        : NamedQueryTypes.MULTI_CLASS
      : NamedQueryTypes.FULL_TEXT;
  }
}
