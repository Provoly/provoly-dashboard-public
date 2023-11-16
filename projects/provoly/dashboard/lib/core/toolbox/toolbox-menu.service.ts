import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { WidgetFactoryService } from '../../dashboard/components/widgets/widget-instanciator/widget-factory.service';
import { DashboardActions } from '../../dashboard/store/dashboard.actions';
import { PryVisibility } from '../components/share/share.model';
import { Widget } from '../model/widget.interface';
import { ConfigActions } from '../store/config/config.actions';
import { ConfigSelectors } from '../store/config/config.selectors';
import { DEFAULT_ICON_URL } from '../store/config/icon-definitions.interface';
import { ToolboxManifestService } from './toolbox-manifest.service';
import { WidgetManifest } from '../model/manifest.interface';

export type WidgetDescriptionBase = {
  icon: string;
  label: string;
};

export type WidgetDescriptionMenu = WidgetDescriptionBase & {
  opened: boolean;
  sub: CatalogEntry[];
};

export type CatalogEntry = WidgetDescriptionBase & {
  category?: string;
  type: string;
  description?: string;
  isCustom?: boolean;
  visibility?: PryVisibility;
  cover?: boolean;
};

export const defaultMenuStructure: WidgetDescriptionMenu[] = [
  {
    icon: 'share_location',
    label: '@pry.toolbox.sub.map',
    opened: false,
    sub: [
      { icon: 'map', label: '@pry.toolbox.simplemap', type: 'simplemap' },
      { icon: 'bubble-chart-line', label: '@pry.toolbox.heatmap', type: 'heatmap' },
      { icon: 'bulles', label: '@pry.toolbox.bubblemap', type: 'bubblemap' },
      { icon: 'place', label: '@pry.toolbox.markermap', type: 'markermap' }
    ]
  },
  {
    icon: 'show_chart',
    label: '@pry.toolbox.sub.chart',
    opened: false,
    sub: [
      { icon: 'bar_chart', label: '@pry.toolbox.barchart', type: 'barchart' },
      { icon: 'bar_chart', label: '@pry.toolbox.histogram', type: 'histogram' },
      { icon: 'show_chart', label: '@pry.toolbox.linechart', type: 'linechart' },
      { icon: 'auto_graph', label: '@pry.toolbox.pointchart', type: 'pointchart' },
      { icon: 'area_chart', label: '@pry.toolbox.areachart', type: 'areachart' },
      { icon: 'donut_large', label: '@pry.toolbox.arcchart', type: 'arcchart' },
      { icon: 'bar_chart', label: '@pry.toolbox.vega', type: 'vega' }
    ]
  },
  {
    icon: 'toc',
    label: '@pry.toolbox.sub.other',
    opened: false,
    sub: [
      { icon: 'table_chart', label: '@pry.toolbox.table', type: 'table' },
      { icon: 'toc', label: '@pry.toolbox.detail', type: 'detail' },
      { icon: 'graph', label: '@pry.toolbox.graph', type: 'graph' },
      { icon: 'settings_applications', label: '@pry.toolbox.iframe', type: 'iframe' },
      { icon: 'tile', label: '@pry.toolbox.tile', type: 'tile' },
      { icon: 'code-box', label: '@pry.toolbox.template', type: 'template' }
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class ToolboxMenuService {
  _menuStructure$ = new BehaviorSubject<WidgetDescriptionMenu[]>(defaultMenuStructure);
  menuStructure$: Observable<WidgetDescriptionMenu[]>;
  menuList$: Observable<CatalogEntry[]>;
  types$: Observable<{ icon: string; label: string; type: string; manifest: WidgetManifest }[]>;

  constructor(
    private widgetFactoryService: WidgetFactoryService,
    private toolboxManifestService: ToolboxManifestService,
    private store: Store
  ) {
    this.menuStructure$ = combineLatest([
      this._menuStructure$,
      this.widgetFactoryService.reference$,
      this.store.select(ConfigSelectors.catalog)
    ]).pipe(
      map(([menuStructure, reference, catalog]) =>
        // Generic widgets
        menuStructure
          .filter((menu) => menu.sub.find((sub) => reference[this.toolboxManifestService.get(sub.type).type]))
          .map(
            (menu) =>
              ({
                ...menu,
                sub: menu.sub
                  .filter((sub) => reference[this.toolboxManifestService.get(sub.type).type])
                  .map((entry) => ({ ...entry, icon: 'assets/svgs/' + entry.icon + '.svg' })) as CatalogEntry[]
              } as WidgetDescriptionMenu)
          )
          // User defined widget configurations
          .concat({
            icon: 'library_add',
            label: '@pry.toolbox.catalog.title',
            opened: false,
            sub: [
              ...catalog.map((widget) => ({
                icon: widget.image,
                label: widget.name,
                type: widget.id,
                description: widget.description,
                isCustom: true,
                visibility: widget.visibility,
                cover: widget.cover
              }))
            ]
          })
      )
    );

    this.menuList$ = this.menuStructure$.pipe(
      map((menuDescription) =>
        menuDescription
          .map((menu) =>
            menu.sub.map((subMenu) => ({
              ...subMenu,
              category: menu.label
            }))
          )
          .reduce((p, c) => [...p, ...c], [])
      )
    );

    this.types$ = combineLatest([
      this.toolboxManifestService.initialManifests$,
      this.menuStructure$,
      this.widgetFactoryService.reference$
    ]).pipe(
      map(([manifests, menuStructure, reference]) => {
        const types = [
          ...new Set(
            Object.values(manifests)
              .filter((manifest) => reference[manifest.type])
              .map((manifest) => manifest.type)
          )
        ];
        return types.map((type) => {
          const matchingMenu = menuStructure.find(
            (menu) => menu.label.replace('@pry.toolbox.sub.', '').indexOf(type) >= 0
          );
          if (!!matchingMenu) {
            return {
              type,
              label: matchingMenu.label,
              icon: matchingMenu.icon,
              manifest: Object.values(manifests).find((manifest) => manifest.type === type) as WidgetManifest
            };
          }
          const matchingSubMenu = menuStructure
            .map((menu) => menu.sub.find((sub) => sub.label.replace('@pry.toolbox.', '').indexOf(type) >= 0))
            .filter((matching) => !!matching)[0];
          if (!!matchingSubMenu) {
            return {
              type,
              label: matchingSubMenu.label,
              icon: matchingSubMenu.icon.replace('assets/svgs/', '').replace(/.svg$/, ''),
              manifest: Object.values(manifests).find((manifest) => manifest.type === type) as WidgetManifest
            };
          }
          return { type, label: type, icon: DEFAULT_ICON_URL, manifest: {} as WidgetManifest };
        });
      })
    );
  }

  addMenu(icon: string, label: string) {
    if (!this._menuStructure$.getValue().find((menu) => menu.label === label)) {
      this._menuStructure$.next(this._menuStructure$.getValue().concat({ icon, label, opened: false, sub: [] }));
    }
  }

  addWidget(menuLabel: string, icon: string, label: string, type: string) {
    const menu = this._menuStructure$.getValue().find((menu) => menu.label === menuLabel);
    if (!menu) {
      console.error(`Menu with label ${menuLabel} has not been found`);
    } else {
      menu.sub.push({ icon, label, type });
    }
  }

  setMenuStructure(structure: WidgetDescriptionMenu[]) {
    this._menuStructure$.next(structure);
  }

  addToCatalog(widget: Widget, index: number) {
    if (this.isValidForCatalog(widget.name)) {
      const manifest = JSON.parse(widget.content);
      this.store.dispatch(DashboardActions.updateWidgetManifest({ manifest, index }));
      this.store.dispatch(ConfigActions.saveWidget({ widget }));
      this.toolboxManifestService.set(widget.id, manifest);
    } else {
      console.error(`Trying to add existing type "${name}"`);
    }
  }

  isValidForCatalog(name: string) {
    return !!name && name.length > 3 && !this.toolboxManifestService.get(name);
  }
}
