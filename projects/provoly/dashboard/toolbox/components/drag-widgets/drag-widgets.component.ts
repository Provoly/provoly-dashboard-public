import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfigActions, ToolboxManifestService, ToolboxMenuService, WidgetDescriptionMenu } from '@provoly/dashboard';
import { Observable } from 'rxjs';

@Component({
  selector: 'pry-drag-widgets',
  templateUrl: './drag-widgets.component.html'
})
export class DragWidgetsComponent {
  @Input() labels = true;
  mainOpened = false;

  readonly connectedPosition: ConnectedPosition = {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top'
  };
  menu$: Observable<WidgetDescriptionMenu[]>;

  constructor(
    private store: Store,
    private toolboxManifestService: ToolboxManifestService,
    public toolboxMenuService: ToolboxMenuService
  ) {
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
