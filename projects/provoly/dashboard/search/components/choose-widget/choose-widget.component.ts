import { ConnectedPosition } from '@angular/cdk/overlay';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  CatalogEntry,
  NamedQueryTypes,
  SubscriptionnerDirective,
  ToolboxManifestService,
  ToolboxMenuService
} from '@provoly/dashboard';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'pry-choose-widget',
  templateUrl: './choose-widget.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ChooseWidgetComponent extends SubscriptionnerDirective implements OnChanges {
  @ViewChild('chooseWidgets') chooseWidgets!: ElementRef<HTMLButtonElement>;
  selectedWidget?: Element | null;
  widgetSelected?: { icon: string; label: string; type: string };
  @Input() panelOpen: boolean = false;
  readonly FULL_TEXT = NamedQueryTypes.FULL_TEXT;
  @Output() selected = new EventEmitter<string>();
  readonly TOP_POSITION: ConnectedPosition = {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom'
  };
  readonly BOTTOM_POSITION: ConnectedPosition = {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top'
  };
  @Input() mode = 'button';
  @Input() width = 200;
  widgets$: Observable<CatalogEntry[]>;

  constructor(
    private toolboxMenuService: ToolboxMenuService,
    private toolboxManifestService: ToolboxManifestService
  ) {
    super();
    this.widgets$ = this.toolboxMenuService.menuStructure$.pipe(
      map((menu) =>
        menu
          .map((items) => [...items.sub.filter((s) => this.toolboxManifestService.isModel(s.type))])
          .reduce((acc, items) => [...acc, ...items], [])
      )
    );
    this.subscriptions.add(
      this.widgets$.subscribe(
        (widgets) => (this.widgetSelected = [...widgets].sort((a, b) => (a.type === 'table' ? -1 : 1))[0])
      )
    );
  }

  ngOnChanges(): void {
    if (this.panelOpen) {
      setTimeout(() => {
        this.chooseWidgets.nativeElement.focus();
      }, 10);
    }
  }

  togglePopup() {
    this.panelOpen = !this.panelOpen;
  }

  onSelectWidget(type: { icon: string; label: string; type: string }) {
    this.widgetSelected = type;
    this.selected.emit(type.type);
  }
}
