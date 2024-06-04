import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, Inject, Optional } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  ConfigActions,
  PRY_ACCESS_TOKEN,
  PryBaseAccess,
  ToolboxManifestService,
  ToolboxMenuService,
  WidgetDescriptionMenu
} from '@provoly/dashboard';
import { Observable } from 'rxjs';
import { ToolboxActionComponent } from '../../shared/toolbox-action/toolbox-action.component';

@Component({
  selector: 'pry-drag-widgets',
  templateUrl: './drag-widgets.component.html'
})
export class DragWidgetsComponent extends ToolboxActionComponent {
  mainOpened = false;

  readonly connectedPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top'
  };
  menu$: Observable<WidgetDescriptionMenu[]>;

  constructor(
    store: Store,
    @Optional() @Inject(PRY_ACCESS_TOKEN) access: PryBaseAccess,
    private toolboxManifestService: ToolboxManifestService,
    public toolboxMenuService: ToolboxMenuService
  ) {
    super(store, access);
    this.store.dispatch(ConfigActions.loadWidgets());
    this.menu$ = this.toolboxMenuService.menuStructure$;
  }

  dragStart($event: DragEvent, type: string) {
    this.toolboxManifestService.dataTransfer($event, type);

    setTimeout(() => {
      this.mainOpened = false;
    }, 100);
  }

  openMenu($event: Event) {
    this.mainOpened = true;
    $event.stopPropagation();
  }
}
