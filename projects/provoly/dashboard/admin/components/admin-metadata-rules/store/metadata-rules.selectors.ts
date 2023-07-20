import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromMetadataRules from './metadata-rules.reducer';

const feature = createFeatureSelector<fromMetadataRules.MetadataRulesState>(
  fromMetadataRules.adminMetadataRulesFeatureKey
);

const metadataRulesList = createSelector(feature, (state) => state?.list);
const metadataRulesSelectedId = createSelector(feature, (state) => state?.metadataRulesSelected?.id);
const metadataRulesSelected = createSelector(feature, (state) => state?.metadataRulesSelected);

export const MetadataRulesSelectors = {
  feature,
  metadataRulesList,
  metadataRulesSelected,
  metadataRulesSelectedId
};
