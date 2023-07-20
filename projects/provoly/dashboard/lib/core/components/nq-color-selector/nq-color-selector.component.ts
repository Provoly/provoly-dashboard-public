import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ConfigActions } from '../../store/config/config.actions';
import { ConfigSelectors } from '../../store/config/config.selectors';
import { DataSourceActions } from '../../store/data-source/data-source.actions';
import { DataSource } from '../../store/data-source/data-source.model';

@Component({
  selector: 'pry-nq-color-selector',
  templateUrl: './nq-color-selector.component.html'
})
export class PryNqColorSelectorComponent {
  @Input() disabled = false;
  @Input() datasource?: DataSource;
  @Output() colorChanged = new EventEmitter<string>();
  @ViewChild('template', { read: TemplateRef }) template!: TemplateRef<any>;

  possibleColors$: Observable<string[]>;

  private overlayRef?: OverlayRef;

  constructor(
    private store: Store,
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {
    this.possibleColors$ = this.store.select(ConfigSelectors.availableColors);
  }

  get dsColor() {
    return this.datasource?.sourceType === 'namedQuery' ? this.datasource.color : '#FFFFFF';
  }

  toggleColorChoice($event?: MouseEvent) {
    if (!this.disabled && !this.overlayRef) {
      this.overlayRef = this.overlay.create(
        new OverlayConfig({
          hasBackdrop: false,
          panelClass: ['color-choice-menu']
        })
      );
      this.store.dispatch(ConfigActions.addingOverlay({ id: this.constructor.name }));
      this.overlayRef.attach(new TemplatePortal(this.template, this.viewContainerRef));
      const contextMenu = document.querySelector('.color-choice-menu') as HTMLDivElement;
      if (!!contextMenu && !!$event) {
        contextMenu.style.left = $event.clientX - 10 + 'px';
        contextMenu.style.top = $event.clientY - 10 + 'px';
        contextMenu.addEventListener('mouseleave', () => this.toggleColorChoice());
      }
    } else {
      this.overlayRef?.dispose();
      this.overlayRef = undefined;
      this.store.dispatch(ConfigActions.closeOverlay({ id: this.constructor.name }));
    }
  }

  changeForColor(color: string) {
    this.colorChanged.emit(color);
    if (!!this.datasource && this.datasource.id && this.datasource.sourceType === 'namedQuery') {
      this.store.dispatch(
        DataSourceActions.namedQuery.post({
          id: this.datasource.id,
          name: this.datasource?.name ?? '',
          description: this.datasource?.description ?? undefined,
          payload: this.datasource?.request,
          color,
          favorite: this.datasource?.favorite ?? false,
          isEdit: false
        })
      );
    }
    this.toggleColorChoice();
  }
}
