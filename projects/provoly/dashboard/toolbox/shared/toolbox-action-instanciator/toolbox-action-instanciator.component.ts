import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Store } from '@ngrx/store';
import { SubscriptionnerDirective } from '@provoly/dashboard';
import { ToolboxAction } from '../../toolbox.model';
import { SaveViewComponent } from '../../components/save-view/save-view.component';
import { ToolboxActionComponent } from '../toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-toolbox-action-instanciator',
  templateUrl: './toolbox-action-instanciator.component.html'
})
export class ToolboxActionInstanciatorComponent extends SubscriptionnerDirective implements AfterViewInit, OnDestroy {
  @Input() displayLabels: boolean = true;
  @Output() closeOptions = new EventEmitter<void>();
  _action!: ToolboxAction;
  @ViewChild('actionContainerRef', { read: ViewContainerRef }) actionContainerRef!: ViewContainerRef;

  constructor(private store: Store<any>, private _cd: ChangeDetectorRef) {
    super();
  }

  @Input() set action(action: ToolboxAction) {
    this._action = action;
    this.ngAfterViewInit();
  }

  ngAfterViewInit() {
    if (this.actionContainerRef) {
      this.actionContainerRef.clear();
      if (this._action.visible) {
        const componentRef = this.actionContainerRef.createComponent<ToolboxActionComponent>(this._action.component);
        this.subscriptions.add(componentRef.instance.closeOptions.subscribe((_) => this.closeOptions.emit()));
        componentRef.instance.displayLabels = this.displayLabels;
        componentRef.location.nativeElement.style.zIndex = 2;

        if (this._action.name === 'default_size') {
          componentRef.location.nativeElement.classList.add('is-screen-size-select');
        }

        if (this._action.name === 'save_view') {
          (componentRef.instance as SaveViewComponent).mode = 'directSave';
        }

        this._cd.detectChanges();
      }
    } else {
      setTimeout(() => this.ngAfterViewInit(), 100);
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.actionContainerRef?.clear();
  }
}
