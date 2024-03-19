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
  edit_presentation_content: boolean;
  share: boolean;
  delete: boolean;
  dashboard_details: boolean;
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
    automate_refresh: false,
    edit_presentation_content: false,
    share: false,
    delete: false,
    dashboard_details: false
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
        toolbox: {
          ...BASE_DISPLAY_OPTIONS.toolbox,
          save_view_as: true,
          refresh_datasets: true,
          edit_presentation_content: true,
          share: true,
          delete: true,
          dashboard_details: true
        },
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
          save_view: true,
          save_view_as: true,
          filter_settings: true,
          new_tab: true,
          clear_view: true,
          default_size: true,
          refresh_datasets: true,
          automate_refresh: true,
          edit_presentation_content: false,
          share: true,
          delete: false,
          dashboard_details: true
        },
        edit_toggle: true,
        widgetContextMenu: true
      };
    default:
      return BASE_DISPLAY_OPTIONS;
  }
}
