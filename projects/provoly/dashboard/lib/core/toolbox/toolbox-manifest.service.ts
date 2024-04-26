import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { MIME_TYPE_WIDGET_MANIFEST, MIME_TYPE_WIDGET_TYPE } from '../../dashboard/components/dashboard.component';
import { SubscriptionnerDirective } from '../../dashboard/components/subscriptionner.directive';
import { DashboardSelectors } from '../../dashboard/store/dashboard.selectors';
import { WidgetLayout, WidgetManifest } from '../model/manifest.interface';
import { GraphType } from '../model/widget-aggregated-chart-manifest.interface';
import { TooltipMode } from '../model/widget-map-manifest.interface';
import { ConfigSelectors } from '../store/config/config.selectors';

export const USE_CURRENT_RESULTSET = 'use-current-resultset';

@Injectable({
  providedIn: 'root'
})
export class ToolboxManifestService extends SubscriptionnerDirective {
  initialManifests$ = new BehaviorSubject<{ [key: string]: WidgetManifest }>({
    simplemap: {
      type: 'map',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: {
        fit: true,
        automaticLayers: true,
        layers: [],
        tooltipMode: TooltipMode.CLICK
      },
      datasource: USE_CURRENT_RESULTSET
    },
    heatmap: {
      type: 'map',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: {
        fit: true,
        layers: [
          {
            type: 'heatmap'
          }
        ],
        tooltipMode: TooltipMode.CLICK
      },
      datasource: USE_CURRENT_RESULTSET
    },
    bubblemap: {
      type: 'map',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: {
        fit: true,
        layers: [
          {
            type: 'bubble'
          }
        ],
        tooltipMode: TooltipMode.CLICK
      },
      datasource: USE_CURRENT_RESULTSET
    },
    markermap: {
      type: 'map',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: {
        fit: true,
        layers: [
          {
            type: 'marker'
          }
        ],
        tooltipMode: TooltipMode.CLICK
      },
      datasource: USE_CURRENT_RESULTSET
    },
    table: {
      type: 'table',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: {},
      datasource: USE_CURRENT_RESULTSET
    },
    barchart: {
      type: 'chart',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: { graph: { type: GraphType.BAR } },
      datasource: USE_CURRENT_RESULTSET
    },
    histogram: {
      type: 'chart',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: { graph: { type: GraphType.HISTOGRAM } },
      datasource: USE_CURRENT_RESULTSET
    },
    linechart: {
      type: 'chart',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: { graph: { type: GraphType.CURVE } },
      datasource: USE_CURRENT_RESULTSET
    },
    pointchart: {
      type: 'chart',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: { graph: { type: GraphType.POINTS } },
      datasource: USE_CURRENT_RESULTSET
    },
    areachart: {
      type: 'chart',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: { graph: { type: GraphType.AREA } },
      datasource: USE_CURRENT_RESULTSET
    },
    arcchart: {
      type: 'chart',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: { graph: { type: GraphType.CIRCULAR } },
      datasource: USE_CURRENT_RESULTSET
    },
    detail: {
      type: 'detail',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: {}
    },
    iframe: {
      type: 'iframe',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: {}
    },
    graph: {
      type: 'graph',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: {
        miniMap: true
      },
      datasource: USE_CURRENT_RESULTSET
    },
    tile: {
      type: 'tile',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: {},
      datasource: USE_CURRENT_RESULTSET
    },
    template: {
      type: 'template',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: { html: '', css: '' },
      datasource: USE_CURRENT_RESULTSET
    },
    vega: {
      type: 'vega',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: {
        placeData: ['data', 0, 'values'],
        baseSpec: {}
      },
      datasource: USE_CURRENT_RESULTSET
    },
    analytic: {
      type: 'analytic',
      layout: {
        x: 1,
        y: 1,
        height: 2,
        width: 3
      },
      options: { primaryProp: '', secondaryProp: '', verticalProp: '', valueProp: '' },
      datasource: USE_CURRENT_RESULTSET
    }
  });

  currentResultSet: string[] = [];

  constructor(private store: Store<any>) {
    super();
    this.subscriptions.add(
      this.store.select(DashboardSelectors.defaultDatasourceNames).subscribe((rsName) => {
        this.currentResultSet = rsName;
      })
    );

    this.subscriptions.add(
      this.store.select(ConfigSelectors.catalog).subscribe((widgets) => {
        widgets.forEach((widget) => this.set(widget.id, { ...JSON.parse(widget.content), title: widget.name }));
      })
    );
  }

  get(id: string, instanciate = true): WidgetManifest {
    const manifest = this.initialManifests$.getValue()[id];
    if (!manifest) {
      return manifest;
    }
    const copy = JSON.parse(JSON.stringify(manifest));
    if (instanciate && !!copy && copy.datasource === USE_CURRENT_RESULTSET) {
      copy.datasource = [];
    }
    return copy;
  }

  set(id: string, manifest: WidgetManifest): void {
    this.initialManifests$.next({ ...this.initialManifests$.getValue(), [id]: manifest });
  }

  setAllLayouts(layout: WidgetLayout): void {
    Object.keys(this.initialManifests$.getValue()).forEach(
      (key) => (this.initialManifests$.getValue()[key].layout = JSON.parse(JSON.stringify(layout)))
    );
  }

  isModel(id: string) {
    const manifest = this.get(id, false);
    return !!manifest && manifest.datasource === USE_CURRENT_RESULTSET;
  }

  dataTransfer($event: DragEvent, id: string) {
    if (!!$event && !!$event.dataTransfer && !$event.dataTransfer.types.includes(MIME_TYPE_WIDGET_MANIFEST)) {
      const manifest = this.get(id);

      $event.dataTransfer.dropEffect = 'copy';
      $event.dataTransfer.effectAllowed = 'copy';

      $event.dataTransfer.setData(MIME_TYPE_WIDGET_MANIFEST, JSON.stringify(manifest));
      $event.dataTransfer.setData(MIME_TYPE_WIDGET_TYPE + manifest.type, 'unused');
    }
  }
}
