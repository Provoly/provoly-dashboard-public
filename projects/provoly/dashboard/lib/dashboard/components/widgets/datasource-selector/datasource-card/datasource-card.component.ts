import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DataSource } from '../../../../../core/store/data-source/data-source.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'pry-datasource-card',
  templateUrl: './datasource-card.component.html'
})
export class PryDatasourceCardComponent {
  @Input() datasource!: DataSource;
  @Input() showFooter: boolean = false;
  @Input() isSelectable: boolean = false;
  @Input() isSelected: boolean = false;
  @Output() clicked = new EventEmitter<{ datasource: DataSource; isSelected: boolean }>();

  constructor(private store: Store) {}

  truncateDescription(description: string | undefined, maxLength: number): string {
    if (description && description.length > maxLength) {
      return description.slice(0, maxLength) + '...';
    }
    return <string>description;
  }

  onClick() {
    if (this.isSelectable) {
      this.isSelected = !this.isSelected;
      this.clicked.emit({ isSelected: this.isSelected, datasource: this.datasource });
    } else {
      this.clicked.emit({ isSelected: false, datasource: this.datasource });
    }
  }
}
