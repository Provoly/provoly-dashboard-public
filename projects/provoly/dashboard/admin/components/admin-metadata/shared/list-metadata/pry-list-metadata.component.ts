import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IMetadata, META_OPTIONS } from '@provoly/dashboard';

export interface IConfigHeader {
  headerType: 'label' | 'icon';
  label: string;
}

@Component({
  selector: 'pry-list-metadata',
  templateUrl: './pry-list-metadata.component.html'
})
export class PryListMetadataComponent {
  @ViewChild('input') input!: ElementRef;

  @Input() sortActive? = 'name';

  @Input() sortDirection? = 'asc';

  @Input() configHeader: Array<IConfigHeader> = [];

  @Input() metadata: Array<IMetadata> | null = [];

  @Input() selectedMetadata: string | null = null;

  @Input() labelMetadataSelected: string = '';

  @Input() editable: boolean = true;

  @Output() editClicked$: EventEmitter<IMetadata> = new EventEmitter<IMetadata>();

  /**
   * @param string: newLabel label for the metadata edited
   */
  @Output() submitModal$: EventEmitter<string> = new EventEmitter<string>();

  @Output() cancelAction$: EventEmitter<void> = new EventEmitter<void>();

  /**
   * @param string
   */
  @Output() rowClicked$: EventEmitter<string> = new EventEmitter<string>();

  editOpened: boolean = false;

  validateAction: () => void;
  cancelAction: () => void;

  constructor() {
    this.validateAction = () => this.validateName(this.labelMetadataSelected);
    this.cancelAction = () => this.cancelEdition();
  }

  openEditMetadata(metadata: IMetadata): void {
    this.editClicked$.emit(metadata);
  }

  cancelEdition(): void {
    this.cancelAction$.emit();
    this.toggleEditionMetadata();
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
    this.submitModal$.emit(newLabel);
    this.toggleEditionMetadata();
  }

  changeValue($event: any) {
    this.labelMetadataSelected = $event;
  }

  goToDetails(id: string) {
    this.rowClicked$.emit(id);
  }

  getTranslationType(type: string) {
    return META_OPTIONS.find((el) => el.varType === type)?.translation || 'undefined';
  }
}
