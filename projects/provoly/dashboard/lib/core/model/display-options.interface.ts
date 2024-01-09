import { ViewMode } from '../../dashboard/store/dashboard.actions';

export interface DisplayOptions {
  presentationTitle: boolean;
  search: boolean;
  catalog: boolean;
  useFilters: boolean;
  toolbox: ToolboxDisplayOptions;
  edit_toggle: boolean;
  widgetContextMenu: boolean | WidgetContextMenuDisplayOptions;
}

export interface ToolboxDisplayOptions {
  save_view: boolean;
  save_view_as: boolean;
  filter_settings: boolean;
  new_tab: boolean;
  clear_view: boolean;
  default_size: boolean;
  refresh_datasets: boolean;
  automate_refresh: boolean;
}

export interface WidgetContextMenuDisplayOptions {
  datasourceSelection: boolean;
  parameters: boolean;
  window: boolean;
  maximize: boolean;
  addToCatalog: boolean;
  delete: boolean;
  changeSpot: boolean;
}

export const BASE_DISPLAY_OPTIONS = {
  presentationTitle: true,
  search: false,
  catalog: false,
  useFilters: false,
  toolbox: {
    save_view: false,
    save_view_as: false,
    filter_settings: false,
    new_tab: false,
    clear_view: false,
    default_size: false,
    refresh_datasets: false,
    automate_refresh: false
  },
  edit_toggle: false,
  widgetContextMenu: {
    datasourceSelection: true,
    parameters: true,
    window: true,
    maximize: true,
    addToCatalog: true,
    delete: true,
    changeSpot: true
  }
} as DisplayOptions;

export function getDisplayOptions(mode?: ViewMode): DisplayOptions {
  switch (mode) {
    case ViewMode.CONSULT:
      return {
        ...BASE_DISPLAY_OPTIONS,
        useFilters: true,
        toolbox: { ...BASE_DISPLAY_OPTIONS.toolbox, save_view_as: true, refresh_datasets: true },
        widgetContextMenu: false
      };
    case ViewMode.SEARCH:
      return {
        ...BASE_DISPLAY_OPTIONS,
        presentationTitle: false,
        search: true,
        toolbox: { ...BASE_DISPLAY_OPTIONS.toolbox, clear_view: true, default_size: true, refresh_datasets: true },
        edit_toggle: true
      };

    case ViewMode.EDITION:
    case ViewMode.CREATION:
      return {
        ...BASE_DISPLAY_OPTIONS,
        catalog: true,
        useFilters: true,
        toolbox: {
          ...(Object.keys(BASE_DISPLAY_OPTIONS.toolbox) as (keyof ToolboxDisplayOptions)[]).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {} as ToolboxDisplayOptions)
        },
        edit_toggle: true,
        widgetContextMenu: true
      };
    default:
      return BASE_DISPLAY_OPTIONS;
  }
}
