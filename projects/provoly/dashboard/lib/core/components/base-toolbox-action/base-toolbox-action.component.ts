import { ConnectedPosition } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseToolboxAction } from '../base-toolbox/base-toolbox-action.interface';

@Component({
  selector: 'pry-base-toolbox-action',
  templateUrl: './base-toolbox-action.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseToolboxActionComponent {
  private readonly connectedPositionAction: ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top'
  };
  private readonly connectedPositionIconAction: ConnectedPosition = {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top'
  };

  @Input() baseToolboxTranslation = '';
  @Input() action!: BaseToolboxAction;

  @Input() set iconAction(val: boolean) {
    this._iconAction = val;
    this.connectedPositions = [this._iconAction ? this.connectedPositionIconAction : this.connectedPositionAction];
    this._cd.markForCheck();
  }

  get iconAction(): boolean {
    return this._iconAction;
  }

  private _iconAction = false;

  connectedPositions: ConnectedPosition[] = [this.connectedPositionAction];
  panelOpen = false;

  constructor(
    protected store: Store<any>,
    private _cd: ChangeDetectorRef
  ) {}

  select(toolboxAction: BaseToolboxAction): void {
    if (toolboxAction.action) {
      this.store.dispatch(toolboxAction.action);
      this.panelOpen = false;
    } else {
      this.panelOpen = true;
    }
    this._cd.markForCheck();
  }

  onClosePanel() {
    this.panelOpen = false;
    this._cd.markForCheck();
  }
}
