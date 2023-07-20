import { Component, Input } from '@angular/core';

@Component({
  selector: 'pry-modal',
  templateUrl: './modal.component.html'
})
export class PryModalComponent {
  @Input() titleModal: string = '';

  @Input() opened: boolean = false;

  @Input() validateLabel: string = '';

  @Input() validateAction: () => void = () => {};

  @Input() cancelLabel: string = '';

  @Input() cancelAction: () => void = () => {};
}
