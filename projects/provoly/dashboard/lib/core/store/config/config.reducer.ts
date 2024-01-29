import { createReducer, on } from '@ngrx/store';
import { TooltipOfClass } from '../../model/tooltip-of-class.interface';
import { ChartOption } from '../../model/widget-chart-manifest.interface';
import { Widget } from '../../model/widget.interface';
import { ConfigActions } from './config.actions';
import { ChartOptionDefault, defaultColors } from './config.widget.constants';
import { IconDefinitions } from './icon-definitions.interface';
import { Versions } from './versions.interface';
import { Group } from '../../components/share/share.model';

export const configFeatureKey = '@pry/config';

export interface ConfigState {
  pryUrl: string;
  mapUrl: string;
  wsUrl: string;
  geoServerUrl: string;
  iconDefinitions: IconDefinitions;
  tooltipDefinitions: { [key: string]: TooltipOfClass };
  filterDefinitions: { [key: string]: TooltipOfClass };
  tableDefaultDefinitions: { [key: string]: string[] };
  tileDefinitions: { [key: string]: string[] };
  mapStyles: { identifier: string; label: string }[];
  availableColors: string[];
  overlayList: string[];
  breakpoint: number;
  defaultViewUsed: boolean;
  catalog: Widget[];
  chartOption: ChartOption;
  maxAttributesInTiles: number;
  versions: Versions | null;
  accessGroups: Group[];
  limits: { [key: string]: number };
}

export const initialConfigState: ConfigState = {
  pryUrl: '',
  mapUrl: '',
  wsUrl: '',
  geoServerUrl: '',
  iconDefinitions: {},
  tooltipDefinitions: { '': { type: 'none' } },
  filterDefinitions: {},
  tableDefaultDefinitions: {},
  tileDefinitions: {},
  mapStyles: [],
  availableColors: defaultColors,
  overlayList: [],
  breakpoint: 700,
  defaultViewUsed: false,
  catalog: [],
  chartOption: ChartOptionDefault,
  maxAttributesInTiles: 5,
  versions: null,
  accessGroups: [],
  limits: {}
};

export const configReducer = createReducer(
  initialConfigState,
  on(ConfigActions.defineUrls, (state, action) => ({
    ...state,
    mapUrl: action.mapUrl ?? state.mapUrl,
    pryUrl: action.pryUrl ?? state.pryUrl,
    wsUrl: action.wsUrl ?? state.wsUrl,
    geoServerUrl: action.geoServerUrl ?? state.geoServerUrl
  })),
  on(ConfigActions.updateIcons, (state, action) => ({
    ...state,
    iconDefinitions: {
      ...state.iconDefinitions,
      ...action.definitions
    }
  })),
  on(ConfigActions.defineMapStyles, (state, action) => ({
    ...state,
    mapStyles: action.styles
  })),
  on(ConfigActions.updateTooltip, (state, action) => ({
    ...state,
    tooltipDefinitions: {
      ...state.tooltipDefinitions,
      ...action.definitions
    }
  })),
  on(ConfigActions.updateFilter, (state, action) => ({
    ...state,
    filterDefinitions: {
      ...state.filterDefinitions,
      ...action.definitions
    }
  })),
  on(ConfigActions.updateTableDefaultAttributes, (state, action) => ({
    ...state,
    tableDefaultDefinitions: {
      ...state.tableDefaultDefinitions,
      ...action.definitions
    }
  })),
  on(ConfigActions.updateTileAttributes, (state, action) => ({
    ...state,
    tileDefinitions: {
      ...state.tileDefinitions,
      ...action.definitions
    }
  })),
  on(ConfigActions.defineColors, (state, action) => ({
    ...state,
    availableColors: action.colors
  })),
  on(ConfigActions.addingOverlay, (state, action) => ({
    ...state,
    overlayList: [...state.overlayList, action.id]
  })),
  on(ConfigActions.closeOverlay, (state, action) => ({
    ...state,
    overlayList: state.overlayList.filter((id) => id !== action.id)
  })),
  on(ConfigActions.defineBreakpoint, (state, action) => ({
    ...state,
    breakpoint: action.breakpoint
  })),
  on(ConfigActions.loadedCustomization, (state, action) => ({
    ...state,
    iconDefinitions: {
      ...state.iconDefinitions,
      ...action.icons
    },
    tooltipDefinitions: {
      ...state.tooltipDefinitions,
      ...action.tooltips
    },
    filterDefinitions: {
      ...state.filterDefinitions,
      ...action.filters
    },
    tableDefaultDefinitions: {
      ...state.tableDefaultDefinitions,
      ...action.tableAttributes
    },
    tileDefinitions: {
      ...state.tileDefinitions,
      ...action.tileAttributes
    }
  })),
  on(ConfigActions.saveWidget, (state, action) => ({
    ...state,
    catalog: [...state.catalog, action.widget]
  })),
  on(ConfigActions.loadedWidgets, (state, action) => ({
    ...state,
    catalog: [...action.widgets]
  })),
  on(ConfigActions.loadedChartOption, (state, action) => ({
    ...state,
    chartOption: action.chartOption
  })),
  on(ConfigActions.updateChartOption, (state, action) => ({
    ...state,
    chartOption: {
      type: action.chartOption.type ?? state.chartOption.type,
      subType: action.chartOption.subType ?? state.chartOption.subType,
      aggregation: action.chartOption.aggregation ?? state.chartOption.aggregation,
      color: action.chartOption.color ?? state.chartOption.color
    }
  })),
  on(ConfigActions.updateMaxAttributesInTiles, (state, action) => ({
    ...state,
    maxAttributesInTiles: action.max
  })),
  on(ConfigActions.loadVersionsSuccess, (state, { versions }) => ({
    ...state,
    versions: versions
  })),
  on(ConfigActions.loadVersionsFailure, (state) => ({
    ...state,
    versions: null
  })),
  on(ConfigActions.loadAccessGroupsSuccess, (state, action) => ({
    ...state,
    accessGroups: action.groups
  })),
  on(ConfigActions.defineLimits, (state, action) => ({
    ...state,
    limits: { ...state.limits, ...action.limits }
  }))
);
