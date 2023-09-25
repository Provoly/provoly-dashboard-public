import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, ElementRef, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfigActions, ViewMode } from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { PipelineActions } from '../../store/pipeline.actions';
import { PipelineSelectors } from '../../store/pipeline.selectors';
import { ExecutionState, PryTransfo } from '../pipeline-editor/pipeline.interface';

@Component({
  selector: 'pry-pipeline-list',
  templateUrl: './pipeline-list.component.html'
})
export class PryPipelineListComponent {
  transformation$: Observable<PryTransfo[]>;
  sortActive? = 'creationDate';
  sortDirection? = 'desc';
  toggleIndex?: number;
  selectedTransfo?: PryTransfo;
  overlayRef: any;
  @ViewChild('dropdown', { read: TemplateRef }) templateDropdown!: TemplateRef<any>;
  @ViewChild('templateModal', { read: TemplateRef }) templateModal!: TemplateRef<any>;
  @ViewChild('actions') actions!: ElementRef<HTMLButtonElement>;
  @ViewChild('toggleActions') toggleActions!: ElementRef<HTMLButtonElement>;
  @ViewChild('cancel') cancel!: ElementRef<HTMLButtonElement>;
  @ViewChild('cross') cross!: ElementRef<HTMLButtonElement>;
  @ViewChild('confirm') confirm!: ElementRef<HTMLButtonElement>;
  selectedMode: ViewMode = ViewMode.CATALOG;
  ViewMode = ViewMode;
  private confirmExecutionRef?: OverlayRef;

  constructor(private store: Store, private overlay: Overlay, private viewContainerRef: ViewContainerRef) {
    this.store.dispatch(PipelineActions.fetchTransfosList());
    this.transformation$ = this.store.select(PipelineSelectors.transfos);
    this.selectedMode = ViewMode.CATALOG;
  }

  toggleMoreDropdown($event: any, index: number, transfo: PryTransfo) {
    if (this.toggleIndex !== index) {
      this.selectedTransfo = transfo;
      this.toggleIndex = index;
      this.overlayRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['modal'],
          backdropClass: 'backdrop'
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
      this.overlayRef.backdropClick().subscribe(() => this.toggleMoreDropdown($event, index, transfo));
      this.overlayRef.attach(new TemplatePortal(this.templateDropdown, this.viewContainerRef));
      setTimeout(() => {
        this.toggleActions.nativeElement.focus();
      }, 10);
      const modal = document.querySelector('div.modal') as HTMLDivElement;
      if (!!modal) {
        if ($event.pointerType === 'mouse') {
          modal.style.left = $event.clientX - 150 + 'px';
          modal.style.top = $event.clientY - 10 + 'px';
        } else {
          const toggleMenuButton = document.querySelector('#' + $event.target.id);
          const rect = toggleMenuButton?.getBoundingClientRect();
          modal.style.left = (rect?.left ?? 0) - (modal?.clientWidth ?? 0) + 'px';
          modal.style.top = (rect?.top ?? 0) + 'px';
        }
      }
    } else {
      this.overlayRef?.dispose();
      this.closeDropdown();
    }
  }

  closeDropdown() {
    this.overlayRef?.dispose();
    this.toggleIndex = undefined;
    this.overlayRef = undefined;
    this.actions.nativeElement.focus();
  }

  toggleState(selectedTransfo: PryTransfo) {
    if (selectedTransfo) {
      this.store.dispatch(PipelineActions.toggleActivation({ transfo: selectedTransfo }));
    }
    this.closeDropdown();
  }

  toggleExecuteConfirm() {
    if (!this.confirmExecutionRef) {
      this.confirmExecutionRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: true,
          panelClass: ['o-modal-wrapper'],
          backdropClass: 'backdrop'
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
      this.confirmExecutionRef.attach(new TemplatePortal(this.templateModal, this.viewContainerRef));
      this.confirmExecutionRef.backdropClick().subscribe(() => this.toggleExecuteConfirm());
      const panel = document.querySelector('div.o-modal-wrapper') as HTMLDivElement;
      if (!!panel) {
        panel.style.position = 'fixed';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
      }
      setTimeout(() => {
        this.cancel.nativeElement.focus();
      }, 10);
    } else {
      this.confirmExecutionRef.dispose();
      this.confirmExecutionRef = undefined;
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
      this.actions.nativeElement.focus();
      this.closeDropdown();
    }
  }

  cancelRemoveConfirm() {
    this.confirmExecutionRef?.dispose();
    this.confirmExecutionRef = undefined;
    this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
    this.closeDropdown();
  }

  confirmExecution(selectedTransfo?: PryTransfo) {
    if (selectedTransfo?.jobInstanceId) {
      this.store.dispatch(PipelineActions.executeTransfo({ id: selectedTransfo.jobInstanceId }));
    }
    this.cancelRemoveConfirm();
  }

  list() {
    this.store.dispatch(PipelineActions.fetchTransfosList());
    this.selectedMode = ViewMode.CATALOG;
  }

  create() {
    this.selectedMode = ViewMode.CREATION;
  }

  consult(transfo: PryTransfo) {
    this.selectedTransfo = transfo;
    this.selectedMode = ViewMode.CONSULT;
  }

  savePipeline(transfo: PryTransfo) {
    this.selectedTransfo = transfo;
    this.selectedMode = ViewMode.EDITOR;
  }

  disableSelectedTranso() {
    if (this.selectedTransfo?.active === false) {
      this.closeDropdown();
    }
  }

  focusElement(element: HTMLButtonElement) {
    element.focus();
  }

  navigateContextMenu(button: HTMLButtonElement, nextButton: HTMLButtonElement) {
    if (!nextButton.disabled) {
      nextButton.tabIndex = 0;
      nextButton.focus();
      button.tabIndex = -1;
    }
  }

  protected readonly ExecutionState = ExecutionState;
}
