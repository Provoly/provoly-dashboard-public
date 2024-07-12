import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { PryCheckboxModule } from '@provoly/dashboard/components/checkbox';
import { PryDatePickerModule } from '../core/components/date-picker/date-picker.module';
import { PryIconModule } from '../core/components/icon/icon.module';
import { PryOverlayModule } from '../core/components/overlay/overlay.module';
import { PrySelectModule } from '../core/components/select/select.module';
import { PryToggleModule } from '../core/components/toggle/toggle.module';
import { PryCoreModule } from '../core/core.module';
import { PryI18nModule } from '../core/i18n/i18n.module';
import { ConfigService } from '../core/store/config/config.service';
import { ToolboxManifestService } from '../core/toolbox/toolbox-manifest.service';
import { WebsocketService } from '../core/ws/websocket.service';
import { ActionBusEffects } from './action-bus/effect/action-bus.effects';
import { BusService } from './action-bus/service/bus.service';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { PryObjectEditionComponent } from './components/context-menu/object-edition/object-edition.component';
import { DashboardComponent } from './components/dashboard.component';
import { ManifestsComponent } from './components/manifests/manifests.component';
import { MetadataComponent } from './components/metadata/metadata.component';
import { VizualizeRawComponent } from './components/vizualize-raw/vizualize-raw.component';
import { BaseWidgetComponent } from './components/widgets/base-widget.component';
import { DataWidgetComponent } from './components/widgets/data-widget.component';
import { DatasourceSelectorComponent } from './components/widgets/datasource-selector/datasource-selector.component';
import { ResultSetSizePipe } from './components/widgets/header/resultset-size.pipe';
import { PryWidgetHeaderComponent } from './components/widgets/header/widget-header.component';
import { SettingsComponent } from './components/widgets/settings/settings.component';
import {
  WIDGET_DEFINITION,
  WidgetFactoryService
} from './components/widgets/widget-instanciator/widget-factory.service';
import { WidgetInstanciatorComponent } from './components/widgets/widget-instanciator/widget-instanciator.component';
import { WidgetDefinition } from './components/widgets/widget-instanciator/widgets-definition.model';
import { WidgetPlaceholderComponent } from './components/widgets/widget-placeholder/widget-placeholder.component';
import { WidgetPlacementUtils } from './components/widgets/widget-placement/widget-placement.utils';
import { BaseFilterComponent } from './filter/base-filter.component';
import { FilterInstanciatorComponent } from './filter/components/filter-instanciator/filter-instanciator.component';
import { FilterGroupComponent } from './filter/components/filter-group/filter-group.component';
import { FILTER_DEFINITION, FilterDefinition } from './filter/filter-factory.service';
import { BASE_CONFIG, DashboardInitService } from './store/dashboard-init.service';
import { DashboardEffects } from './store/dashboard.effects';
import { dashboardFeatureKey, dashboardReducer } from './store/dashboard.reducers';
import { RefreshService } from './store/refresh.service';
import { PryTitleService } from './store/title.service';
import { BaseTooltipComponent } from './tooltip/base-tooltip.component';
import { DefaultTooltipComponent } from './tooltip/components/default/default.tooltip.component';
import { TOOLTIP_DEFINITION, TooltipDefinition } from './tooltip/tooltip-factory.service';
import { PryFilterGroupCssComponent } from './filter/style/css.component';
import { AutomaticGridLayoutDefinition } from '../core/model/automatic-grid-layout-definition.interface';
import { PryDatasourceCardComponent } from './components/widgets/datasource-selector/datasource-card/datasource-card.component';
import { PryDatasourceListComponent } from './components/widgets/datasource-selector/datasource-list/datasource-list.component';
import { PrySinceDateModule } from '../core/pipes/since-date/since-date.module';

const components = [
  DashboardComponent,
  WidgetInstanciatorComponent,
  WidgetPlaceholderComponent,
  SettingsComponent,
  ManifestsComponent,
  MetadataComponent,
  ContextMenuComponent,
  DataWidgetComponent,
  BaseWidgetComponent,
  PryWidgetHeaderComponent,
  PryObjectEditionComponent,
  VizualizeRawComponent,
  ResultSetSizePipe,
  DefaultTooltipComponent,
  BaseTooltipComponent,
  BaseFilterComponent,
  FilterInstanciatorComponent,
  FilterGroupComponent,
  DatasourceSelectorComponent,
  PryDatasourceCardComponent,
  PryDatasourceListComponent,
  PryFilterGroupCssComponent
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    FormsModule,
    PrySelectModule,
    PryIconModule,
    OverlayModule,
    PryCoreModule,
    PryCheckboxModule,
    PryToggleModule,
    PryOverlayModule,
    StoreModule.forFeature(dashboardFeatureKey, dashboardReducer),
    EffectsModule.forFeature([ActionBusEffects, DashboardEffects]),
    PryDatePickerModule,
    PryI18nModule,
    PrySinceDateModule
  ],
  exports: [...components],
  providers: []
})
export class PryDashboardModule {
  static forRoot(
    widgetReference: { [key: string]: WidgetDefinition },
    options: {
      path?: string;
      mapUrl?: string;
      pryUrl?: string;
      wsUrl?: string;
      geoServerUrl?: string;
    },
    tooltipReference: { [key: string]: TooltipDefinition },
    filterReference: { [key: string]: FilterDefinition },
    additionalGridLayouts: AutomaticGridLayoutDefinition[] = []
  ): ModuleWithProviders<PryDashboardModule> {
    additionalGridLayouts.forEach((impl) => {
      WidgetPlacementUtils.addGridLayout(impl);
    });
    return {
      ngModule: PryDashboardModule,
      providers: [
        { provide: BASE_CONFIG, useValue: options },
        { provide: WIDGET_DEFINITION, useValue: widgetReference },
        { provide: TOOLTIP_DEFINITION, useValue: tooltipReference },
        { provide: FILTER_DEFINITION, useValue: filterReference },
        BusService,
        DashboardInitService,
        ToolboxManifestService,
        RefreshService,
        PryTitleService,
        WebsocketService,
        ConfigService,
        WidgetFactoryService
      ]
    };
  }

  constructor(store: Store) {}
}
