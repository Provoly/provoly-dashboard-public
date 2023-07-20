import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dataset } from '@provoly/dashboard';

@Component({
  selector: 'pry-dataset-card',
  templateUrl: './dataset-card.component.html'
})
export class PryDatasetCardComponent {
  @Input() dataset!: Dataset;
  @Output() consult = new EventEmitter<Dataset>();

  goToDetailView() {
    this.consult.emit(this.dataset);
  }
}
