import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
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

  constructor(
    private store: Store,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {
    this.store.dispatch(PipelineActions.fetchTransfosList());
    this.transformation$ = this.store.select(PipelineSelectors.transfos);
    this.selectedMode = ViewMode.CATALOG;
  }

  readonly connectedPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top'
  };

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
      // const displayedElement = document.querySelector('div.pipelineList-dropdown__actions') as HTMLDivElement;
      const displayedElement = document.querySelector('.m-context-menu') as HTMLDivElement;
      if (!!modal) {
        modal.style.left =
          Math.max(0, Math.min(window.innerWidth - displayedElement.clientWidth, $event.clientX - 150)) + 'px';
        modal.style.top =
          Math.max(0, Math.min(window.innerHeight - displayedElement.clientHeight, $event.clientY - 10)) + 'px';
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

  focusCrossElement() {
    this.cross.nativeElement.focus();
  }

  focusValidation() {
    this.confirm.nativeElement.focus();
  }

  protected readonly ExecutionState = ExecutionState;
}
