import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-automate-refresh',
  templateUrl: './automate-refresh.component.html'
})
export class AutomateRefreshComponent extends ToolboxActionComponent {
  constructor(store: Store) {
    super(store);
  }
}
