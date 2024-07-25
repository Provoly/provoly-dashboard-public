import { Pixel } from 'ol/pixel';
import { ComponentRef, ElementRef, Injector, ViewContainerRef } from '@angular/core';
import {
  BaseTooltipComponent,
  DashboardActions,
  DashboardSelectors,
  MapGeoServerLayerOptions,
  Size,
  TooltipFactoryService,
  TooltipMode,
  WIDGET_HEADER_HEIGHT
} from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, debounceTime, Observable, Subscription, withLatestFrom } from 'rxjs';
import { Feature, Map, MapBrowserEvent, Overlay } from 'ol';
import { Store } from '@ngrx/store';
import { TOOLTIP_PADDING, WidgetMapComponent } from '../component/widget-map.component';
import { InteractionManager } from './interaction-manager.class';
import { Layer } from 'ol/layer';

export class TooltipManager {
  private tooltipFactoryService!: TooltipFactoryService;
  private injector!: Injector;
  private store!: Store;
  wmsFeatures$!: Observable<any[]>;
  classicFeatures$: BehaviorSubject<any> = new BehaviorSubject([]);
  public tooltipIndex = 0;
  popupOverlay?: Overlay;
  map!: Map;
  popup!: ElementRef;
  popupContent!: ViewContainerRef;
  public tooltipNumber = 0;
  interactionManager!: InteractionManager;
  previousTooltip?: ComponentRef<BaseTooltipComponent>;
  previousTooltipSub?: Subscription;
  public tooltipEvent?: MapBrowserEvent<MouseEvent>;
  parent!: WidgetMapComponent;
  interactionPopupOverlay!: Overlay;

  init(
    tooltipFactoryService: TooltipFactoryService,
    injector: Injector,
    store: Store,
    subscriptions: Subscription,
    widgetSize$: Observable<Size>,
    displayHeader$: Observable<boolean | { [p: string]: boolean }>,
    map: Map,
    popup: ElementRef,
    popupContent: ViewContainerRef,
    interactionManager: InteractionManager,
    parent: WidgetMapComponent
  ) {
    this.tooltipFactoryService = tooltipFactoryService;
    this.injector = injector;
    this.store = store;
    this.parent = parent;
    this.map = map;
    this.popupContent = popupContent;
    this.popup = popup;
    this.interactionManager = interactionManager;
    this.wmsFeatures$ = this.store.select(DashboardSelectors.wmsFeatures(this.parent.id));

    subscriptions.add(
      combineLatest([this.wmsFeatures$, this.classicFeatures$])
        .pipe(debounceTime(50), withLatestFrom(widgetSize$, displayHeader$))
        .subscribe(([[wmsFeatures, classicFeatures], size, header]) => {
          if (map) {
            this.tooltipIndex = 0;
            if (this.popupOverlay !== null) {
              this.clearTooltip();
            }
            this.popupOverlay = new Overlay({
              element: popup.nativeElement,
              offset: [9, 9]
            });
            this.map.addOverlay(this.popupOverlay);
            this.popupContent.clear();
            const componentPromises = [] as Promise<ComponentRef<BaseTooltipComponent> | null>[];
            wmsFeatures.forEach((value) => {
              componentPromises.push(this.generateTooltip(value));
            });
            classicFeatures.forEach((value: any) => {
              componentPromises.push(this.generateTooltip(value.values));
            });

            Promise.all(componentPromises).then((promises) => {
              const realComponents = promises.filter((component) => !!component);
              this.tooltipNumber = realComponents.length;
              if (realComponents.length <= 0) {
                popup.nativeElement.hidden = true;
                this.popupOverlay?.setPosition([-9999999999, -9999999999]);
              } else {
                popup.nativeElement.hidden = false;
                // Do not go outside the map
                const rect = {
                  height: 200 + (header ? WIDGET_HEADER_HEIGHT.value : 0) + TOOLTIP_PADDING,
                  width: 300 + TOOLTIP_PADDING
                };
                let pixel = this.tooltipEvent?.pixel;
                if (!!pixel && pixel[0] + rect.width > size.width) {
                  pixel[0] = size.width - rect.width;
                }
                if (!!pixel && pixel[1] + rect.height > size.height) {
                  pixel[1] = size.height - rect.height;
                }
                setTimeout(() => {
                  this.tooltipMove(0);
                }, 10);
                this.popupOverlay?.setPosition(this.map.getCoordinateFromPixel(pixel ?? [0, 0]));
              }
            });
          }
        })
    );

    window.addEventListener('forceCloseMapTooltip', () => {
      this.clearTooltip();
    });

    this.addOverlayOnInteraction();

    return this;
  }

  private addOverlayOnInteraction() {
    if (!this.interactionPopupOverlay) {
      this.interactionPopupOverlay = new Overlay({
        element: this.popup.nativeElement,
        offset: [9, 9]
      });
      this.map.addOverlay(this.interactionPopupOverlay);
    }

    const popupListener = (event: MapBrowserEvent<MouseEvent>) => {
      const values = this.map.getFeaturesAtPixel(event.pixel, { hitTolerance: 5 });
      const valuesToDisplay = [...new Set(values.map((value) => value.get('id')).filter((id) => !!id))]
        .map((id) => values.find((value) => value.get('id') === id))
        .map((value) => ({
          oClass: value?.get('oClass'),
          coordinates: event.coordinate,
          values:
            value instanceof Feature ? value.getKeys().reduce((p, c) => ({ ...p, [c]: value?.get(c) }), {}) : undefined
        }))
        .filter((value) => value.oClass);
      this.classicFeatures$.next(valuesToDisplay);
      const wmsLayers = this.parent.getWMSLayers();
      if (wmsLayers) {
        this.getFeatureFromServer(wmsLayers, event.coordinate);
      }
      this.tooltipEvent = event;
    };

    if (this.parent.optionsCopy.tooltipMode !== TooltipMode.NONE) {
      this.parent.map.un('singleclick', popupListener);
      this.parent.map.on('singleclick', popupListener);
    }
  }

  generateTooltip(value: {
    oClass: string;
    coordinates: Pixel;
    values: any;
  }): Promise<ComponentRef<BaseTooltipComponent> | null> {
    return new Promise((resolve) => {
      const component$ = this.tooltipFactoryService.generateTooltip(value.oClass, this.injector, this.popupContent);
      this.previousTooltipSub?.unsubscribe();
      this.previousTooltipSub = component$.subscribe((component) => {
        if (component) {
          if (this.previousTooltip) {
            this.previousTooltip.destroy();
          }
          component.instance.data.item = value;
          component.instance.popup = this.popup;
          resolve(component);
        }
        resolve(null);
      });
    });
  }

  public clearTooltip(empty = false) {
    if (this.popupOverlay) this.map?.removeOverlay(this.popupOverlay);
    this.popupContent?.clear();
    this.previousTooltip?.destroy();
    this.previousTooltipSub?.unsubscribe();
    if (empty) {
      this.store.dispatch(DashboardActions.resetWmsFeatures({ componentId: this.parent.id }));
      this.classicFeatures$.next([]);
    }
  }

  public tooltipMove(number: number) {
    if (this.tooltipCanMove(number)) {
      this.setStyleAsync(this.tooltipIndex, 'none');
      this.tooltipIndex = this.tooltipIndex + number;
      this.setStyleAsync(this.tooltipIndex, 'block');
    }
  }

  private setStyleAsync(idx: number, value: string) {
    setTimeout(() => {
      const targetContainer = this.popupContent.get(idx);
      if (targetContainer) {
        // @ts-ignore
        targetContainer.rootNodes[0].style.display = value;
      }
    }, 100);
  }

  public tooltipCanMove(number: number) {
    return this.tooltipIndex + number >= 0 && this.tooltipIndex + number < this.tooltipNumber;
  }

  getFeatureFromServer(wmsLayers: Layer<any>[], pixel: Pixel) {
    for (const layer of wmsLayers) {
      let url = layer
        .getSource()
        .getFeatureInfoUrl(pixel, this.map.getView().getResolution(), this.map.getView().getProjection(), {
          INFO_FORMAT: 'application/json',
          FEATURE_COUNT: 10,
          ...layer.getProperties()['getFeatureInfoAdditionalParameters']
        });
      if (
        (
          this.parent.optionsCopy.layers?.find((l) => {
            return l.title === layer.getProperties()['title'];
          }) as MapGeoServerLayerOptions
        )?.getWfsFeaturesForTooltips
      ) {
        this.store.dispatch(
          DashboardActions.getWfsFeaturesForPointStackTooltips({
            url,
            oClass: layer.getProperties()['oClass'] ?? '',
            coordinates: pixel,
            componentId: this.parent.id,
            geomProName: layer.getProperties()['geomPropName']
          })
        );
      } else {
        if (url && url.indexOf('I=-1') === -1 && url.indexOf('J=-1') === -1) {
          this.store.dispatch(
            DashboardActions.getWmsFeatures({
              url,
              oClass: layer.getProperties()['oClass'] ?? '',
              coordinates: pixel,
              componentId: this.parent.id
            })
          );
        }
      }
    }
  }

  destroy() {
    this.store.dispatch(DashboardActions.resetWmsFeatures({ componentId: this.parent.id }));
    this.previousTooltipSub?.unsubscribe();
    this.previousTooltip?.destroy();
  }
}
