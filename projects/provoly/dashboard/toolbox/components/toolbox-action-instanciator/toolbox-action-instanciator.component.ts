import {
  Component,
  ViewContainerRef,
  Input,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  Output,
  EventEmitter
} from '@angular/core';
import { Store } from '@ngrx/store';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';
import { SaveViewComponent } from '../save-view/save-view.component';
import { ToolboxAction } from '../../toolbox.model';
import { SubscriptionnerDirective } from '@provoly/dashboard';

@Component({
  selector: 'pry-toolbox-action-instanciator',
  templateUrl: './toolbox-action-instanciator.component.html'
})
export class ToolboxActionInstanciatorComponent extends SubscriptionnerDirective implements AfterViewInit {
  @Input() action!: ToolboxAction;
  @Input() displayLabels: boolean = true;
  @Output() closeOptions = new EventEmitter<void>();

  @ViewChild('actionContainerRef', { read: ViewContainerRef }) actionContainerRef!: ViewContainerRef;

  constructor(private store: Store<any>, private _cd: ChangeDetectorRef) {
    super();
  }

  ngAfterViewInit() {
    if (this.action.visible) {
      const componentRef = this.actionContainerRef.createComponent<ToolboxActionComponent>(this.action.component);
      this.subscriptions.add(componentRef.instance.closeOptions.subscribe((_) => this.closeOptions.emit()));
      componentRef.instance.displayLabels = this.displayLabels;
      componentRef.location.nativeElement.style.zIndex = 2;

      if (this.action.name === 'default_size') {
        componentRef.location.nativeElement.classList.add('is-screen-size-select');
      }

      if (this.action.name === 'save_view') {
        (componentRef.instance as SaveViewComponent).mode = 'directSave';
      }

      this._cd.detectChanges();
    }
  }
}
