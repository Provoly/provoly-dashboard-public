import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'pry-tab',
  template: ''
})
export class TabComponent {
  @Input() name = '';
  @Input() templateRef!: TemplateRef<any>;
  @Input() index!: number;
  constructor() {}
}
