import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromConfig from './config.reducer';
import { DEFAULT_ICON_URL, IconDefinitions, IconPosition } from './icon-definitions.interface';

const feature = createFeatureSelector<fromConfig.ConfigState>(fromConfig.configFeatureKey);

const pryUrl = createSelector(feature, (state) => state?.pryUrl);
const wsUrl = createSelector(feature, (state) => state?.wsUrl);
const geoServerUrl = createSelector(feature, (state) => state?.geoServerUrl);
const dataUrl = createSelector(pryUrl, (url) => `${url}/data`);
const refUrl = createSelector(pryUrl, (url) => `${url}/ref`);
const transfoUrl = createSelector(pryUrl, (url) => `${url}/transfo`);
const monitorUrl = createSelector(pryUrl, (url) => `${url}/monitor`);
const geocodingUrl = createSelector(pryUrl, (url) => `${url}/geocoding`);
const replayUrl = createSelector(pryUrl, (url) => `${url}/replay`);
const mapUrl = createSelector(feature, (state) => state?.mapUrl);
const execUrl = createSelector(pryUrl, (url) => `${url}/exec`);

const addDefaultRuleIfNotPresent = (defs: IconDefinitions) => {
  const newDefs = {} as IconDefinitions;
  for (let classe in defs) {
    try {
      const currentRules = defs[classe] ?? [{ iconUrl: DEFAULT_ICON_URL, iconSize: [25, 25] }];
      newDefs[classe] = [...currentRules];
      if (!currentRules.find((rule) => !!rule.isDefault)) {
        const precalculateDefaultRule = currentRules.find((def) => def.position === IconPosition.FULL || !def.position);
        newDefs[classe].push({
          isDefault: true,
          iconUrl: precalculateDefaultRule?.iconUrl ?? DEFAULT_ICON_URL,
          iconSize: [25, 25]
        });
      }
    } catch (e) {
      console.error(`Icons definitions is wrong for class ${classe}`, defs[classe], e);
    }
  }
  return newDefs;
};

const iconDefinitions = createSelector(
  feature,
  (config) =>
    (({
      default: [{ iconUrl: DEFAULT_ICON_URL, iconSize: [25, 25] }],
      ...addDefaultRuleIfNotPresent(config.iconDefinitions)
    } ?? {}) as IconDefinitions)
);

const tooltipDefinitions = createSelector(feature, (config) => config.tooltipDefinitions);
const filterDefinitions = createSelector(feature, (config) => config.filterDefinitions);
const tableDefaultAttributesDefinitions = createSelector(feature, (state) => state?.tableDefaultDefinitions);
const tileAttributesDefinitions = createSelector(feature, (state) => state?.tileDefinitions);

const mapStyles = createSelector(feature, (config) => config.mapStyles);
const availableColors = createSelector(feature, (config) => config.availableColors);
const randomColor = createSelector(
  feature,
  (config) => config.availableColors[(Math.random() * 1457) % config.availableColors.length]
);
const hasOverlay = createSelector(feature, (config) => config.overlayList.length > 0);
const breakpoint = createSelector(feature, (config) => config.breakpoint);
const catalog = createSelector(feature, (config) => config.catalog);
const chartOption = createSelector(feature, (config) => config.chartOption);
const maxAttributesInTiles = createSelector(feature, (config) => config.maxAttributesInTiles);
const selectVersions = createSelector(feature, (state) => state.versions);

export const ConfigSelectors = {
  feature,
  pryUrl,
  dataUrl,
  refUrl,
  transfoUrl,
  wsUrl,
  monitorUrl,
  replayUrl,
  mapUrl,
  geoServerUrl,
  geocodingUrl,
  iconDefinitions,
  tooltipDefinitions,
  filterDefinitions,
  mapStyles,
  availableColors,
  randomColor,
  tableDefaultAttributesDefinitions,
  tileAttributesDefinitions,
  hasOverlay,
  breakpoint,
  catalog,
  chartOption,
  maxAttributesInTiles,
  execUrl,
  selectVersions
};
