import { createAction, props } from '@ngrx/store';
import { TooltipOfClass } from '../../model/tooltip-of-class.interface';
import { ChartOption } from '../../model/widget-chart-manifest.interface';
import { Widget } from '../../model/widget.interface';
import { IconDefinitions } from './icon-definitions.interface';
import { Versions } from './versions.interface';
import { Group } from '../../components/share/share.model';

export const DEFAULT_SEARCH_LIMIT_NUMBER = 200;

export const ConfigActions = {
  defineUrls: createAction(
    '[Config] (bus) defining urls',
    props<{ mapUrl?: string; pryUrl?: string; wsUrl?: string; geoServerUrl?: string }>()
  ),
  updateIcons: createAction('[Config] (bus) updating icons', props<{ definitions: IconDefinitions }>()),
  saveIcons: createAction('[Config] (bus) saving icons', props<{ definitions: IconDefinitions }>()),
  loadCustomization: createAction('[Config] (bus) load all class customization', props<{ force?: boolean }>()),
  loadedCustomization: createAction(
    '[Config] (bus) customization loaded',
    props<{
      icons: IconDefinitions;
      tooltips: { [cl: string]: TooltipOfClass };
      filters: { [cl: string]: TooltipOfClass };
      tableAttributes: { [cl: string]: string[] };
      tileAttributes: { [cl: string]: string[] };
    }>()
  ),
  getMapStyles: createAction('[Config] get map styles'),
  defineMapStyles: createAction(
    '[Config] (bus) defining map styles',
    props<{ styles: { identifier: string; label: string }[] }>()
  ),
  updateTooltip: createAction(
    '[Config] (bus) updating tooltip',
    props<{ definitions: { [cl: string]: TooltipOfClass } }>()
  ),
  updateFilter: createAction(
    '[Config] (bus) updating filter',
    props<{ definitions: { [cl: string]: TooltipOfClass } }>()
  ),
  saveTooltip: createAction(
    '[Config] (bus) saving tooltip',
    props<{ definitions: { [cl: string]: TooltipOfClass } }>()
  ),
  updateTableDefaultAttributes: createAction(
    '[Config] (bus) updating default table attributes',
    props<{ definitions: { [cl: string]: string[] } }>()
  ),
  saveTableDefaultAttributes: createAction(
    '[Config] (bus) saving default table attributes',
    props<{ definitions: { [cl: string]: string[] } }>()
  ),
  updateTileAttributes: createAction(
    '[Config] (bus) updating tile attributes',
    props<{ definitions: { [cl: string]: string[] } }>()
  ),
  saveTileAttributes: createAction(
    '[Config] (bus) saving tile attributes',
    props<{ definitions: { [cl: string]: string[] } }>()
  ),
  defineColors: createAction('[Config] (bus) defining colors', props<{ colors: string[] }>()),
  addingOverlay: createAction('[Config] adding overlay', props<{ id: string }>()),
  closeOverlay: createAction('[Config] close overlay', props<{ id: string }>()),
  defineBreakpoint: createAction('[Config] (bus) defining breakpoint', props<{ breakpoint: number }>()),
  saveWidget: createAction('[Config] (bus) defining widget', props<{ widget: Widget }>()),
  confirmRestitutionDeletion: createAction('[Config] (bus) confirm Restitution deletion', props<{ id: string }>()),
  deleteRestitution: createAction('[Config] (bus) delete Restitution', props<{ id: string }>()),
  loadWidgets: createAction('[Config] (bus) loading widgets'),
  loadedWidgets: createAction('[Config] (bus) loaded widgets', props<{ widgets: Widget[] }>()),
  loadChartOption: createAction('[Config] load chart option'),
  loadedChartOption: createAction('[config] loaded chart option', props<{ chartOption: ChartOption }>()),
  updateChartOption: createAction('[Config] update chart option', props<{ chartOption: Partial<ChartOption> }>()),
  updateMaxAttributesInTiles: createAction('[Config] update max attributes in tiles', props<{ max: number }>()),
  loadVersions: createAction('[about] Load Versions'),
  loadVersionsSuccess: createAction('[about] (bus) Load Versions Success', props<{ versions: Versions }>()),
  loadVersionsFailure: createAction('[about] Load Versions Failure', props<{ error: string }>()),
  loadAccessGroups: createAction('[Users] load access groups'),
  loadAccessGroupsSuccess: createAction('[Config] load access groups Success', props<{ groups: Group[] }>()),
  defineLimits: createAction('[Config] defining limits', props<{ limits: { [key: string]: number } }>())
};
