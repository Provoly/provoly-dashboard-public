import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { ConfigActions } from '../../store/config/config.actions';
import { PryDialogRef } from './dialog-ref';
import { PRY_DIALOG_DATA } from './dialog.service';

export interface PryDialogConfirmData {
  title: string;
  message?: string;
  actions?: PryDialogConfirmAction[];
}

export interface PryDialogConfirmAction {
  id: number;
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  actions?: Action[];
}

@Component({
  selector: 'pry-dialog-confirm',
  templateUrl: './dialog-confirm.component.html'
})
export class PryDialogConfirmComponent {
  @ViewChild('cross') cross!: ElementRef<HTMLButtonElement>;
  @ViewChild('buttonAction') buttonAction!: ElementRef<HTMLDivElement>;

  constructor(
    private dialog: PryDialogRef<PryDialogConfirmComponent>,
    @Inject(PRY_DIALOG_DATA) public data: PryDialogConfirmData,
    private store: Store
  ) {
    setTimeout(() => {
      this.cross.nativeElement.focus();
      this.buttonAction.nativeElement.parentElement?.children[1].addEventListener('keydown', (event: Event) => {
        if ((event as KeyboardEvent).key === 'Tab') {
          this.focusCrossElement();
        }
      });
    }, 10);
  }

  onClick(action?: PryDialogConfirmAction) {
    if (action) {
      if (action.actions) action.actions.forEach((action) => this.store.dispatch(action));
      this.dialog.close(action);
    } else {
      this.dialog.close();
    }
    this.store.dispatch(ConfigActions.closeOverlay({ id: 'PryDialogConfirmComponent' }));
  }

  closeDialog() {
    this.dialog.close();
  }

  focusCrossElement() {
    this.cross.nativeElement.focus();
  }
}
