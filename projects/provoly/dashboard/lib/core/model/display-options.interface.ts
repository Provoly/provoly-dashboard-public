export interface DisplayOptions {
  presentationTitle: boolean;
  search: boolean;
  catalog: boolean;
  useFilters: boolean;
  toolbox: ToolboxDisplayOptions;
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

export enum DisplayMode {
  CONSULT = 'CONSULT',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  SEARCH = 'SEARCH',
  CUSTOM = 'CUSTOM'
}

export function getDisplayOptions(mode: DisplayMode): DisplayOptions {
  const displayOptions: DisplayOptions = {
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
    }
  };

  switch (mode) {
    case DisplayMode.CONSULT:
      return {
        ...displayOptions,
        useFilters: true,
        toolbox: { ...displayOptions.toolbox, save_view_as: true, refresh_datasets: true }
      };
    case DisplayMode.SEARCH:
      return {
        ...displayOptions,
        presentationTitle: false,
        search: true,
        toolbox: { ...displayOptions.toolbox, clear_view: true, default_size: true, refresh_datasets: true }
      };

    case DisplayMode.EDIT:
    case DisplayMode.CREATE:
      return {
        ...displayOptions,
        catalog: true,
        useFilters: true,
        toolbox: {
          ...(Object.keys(displayOptions.toolbox) as (keyof ToolboxDisplayOptions)[]).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {} as ToolboxDisplayOptions)
        }
      };
    default:
      return displayOptions;
  }
}
