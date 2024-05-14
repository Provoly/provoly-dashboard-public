import { createAction, props } from '@ngrx/store';
import { MissingGroupsByEntity, PryVisibility } from '../../components/share/share.model';
import { DatasetPreview } from '../../model/dataset.interface';
import { MonoClassSearchPayload } from '../../model/search-mono-class.model';
import { FullTextSearchPayload, MultiClassSearchPayload } from '../../model/search-multi-class.model';
import { Dataset, DatasetVersion, NamedQuery } from './data-source.model';

export const DataSourceActions = {
  load: createAction('[Datasource] load'),
  namedQuery: {
    load: createAction('[NamedQuery] load'),
    loaded: createAction('[NamedQuery] loaded', props<{ list: NamedQuery[] }>()),
    failure: createAction('[NamedQuery] failure', props<{ error: Error }>()),
    post: createAction(
      '[NamedQuery] post',
      props<{
        name: string;
        id?: string;
        description?: string;
        visibility?: PryVisibility;
        payload: MonoClassSearchPayload | MultiClassSearchPayload | FullTextSearchPayload;
        color?: string;
        favorite: boolean;
        isEdit: boolean;
      }>()
    ),
    delete: createAction('[NamedQuery] delete', props<{ id: string }>()),
    addFavorite: createAction('[NamedQuery] add favorite', props<{ id: string }>()),
    deleteFavorite: createAction('[NamedQuery] delete favorite', props<{ id: string }>()),
    edit: createAction('[NamedQuery] try to edit', props<{ currentEdit: NamedQuery; widgetIndex?: number }>()),
    updateCurrentEdit: createAction(
      '[NamedQuery] update edited named query',
      props<{ currentEdit: Partial<NamedQuery> }>()
    ),
    openEdit: createAction('[NamedQuery] edit', props<{ currentEdit: NamedQuery; widgetIndex?: number }>()),
    stopEdit: createAction('[NamedQuery] delete edit'),
    openRename: createAction('[NamedQuery] rename'),
    stopRename: createAction('[NamedQuery] stop rename')
  },
  dataset: {
    loadDataset: createAction('[Dataset] load datasets'),
    loadedDataset: createAction('[Dataset] loaded datasets', props<{ datasets: Dataset[] }>()),
    failure: createAction('[Dataset] failure effect Dataset', props<{ error: any }>()),

    listVersions: createAction('[Dataset] Get Dataset versions'),
    listVersionsSuccess: createAction(
      '[Dataset] Get Dataset versions Success',
      props<{ versions: DatasetVersion[] }>()
    ),
    listVersionsFailure: createAction('[Dataset] Get Dataset versions Failure'),
    listVersionsByDatasetId: createAction('[Dataset] Get Dataset Versions by Dataset Id', props<{ id: string }>()),
    updateVersionList: createAction(
      '[Dataset] Update Dataset version list',
      props<{ id: string; versions: DatasetVersion[] }>()
    ),
    selectedDatasetVersion: createAction('[Dataset] Select Dataset version', props<{ version: DatasetVersion }>()),
    deactivateDatasetVersion: createAction(
      '[Dataset] Deactivate dataset version',
      props<{
        datasetId: string;
        versionId: string;
      }>()
    ),
    deactivateDatasetVersionSuccess: createAction(
      '[Dataset] Deactivate dataset version success',
      props<{
        datasetVersion: DatasetVersion;
      }>()
    ),
    deactivateDatasetVersionFailure: createAction(
      '[Dataset] Deactivate dataset version failure',
      props<{
        error: any;
      }>()
    ),
    activateDatasetVersion: createAction(
      '[Dataset] Activate dataset version',
      props<{
        datasetId: string;
        versionId: string;
      }>()
    ),
    activateDatasetVersionSuccess: createAction(
      '[Dataset] Activate dataset version success',
      props<{
        datasetVersion: DatasetVersion;
      }>()
    ),
    activateDatasetVersionFailure: createAction(
      '[Dataset] Activate dataset version failure',
      props<{
        error: any;
      }>()
    ),
    previews: {
      getById: createAction('[Dataset/Previews] get by id', props<{ id: string }>()),
      getByIdSuccess: createAction('[Dataset/Previews] get by id Success', props<{ previews: DatasetPreview[] }>()),
      getByIdFailure: createAction('[Dataset/Previews] get by id Failure', props<{ error: any }>())
    },
    updateDatasetVersionInfo: createAction(
      '[Dataset] Update Dataset version info',
      props<{ version: Partial<DatasetVersion> }>()
    ),
    updateDatasetVersionInfoSuccess: createAction(
      '[Dataset] Update Dataset version info success',
      props<{ version: Partial<DatasetVersion> }>()
    ),
    confirmDeleteVersion: createAction('[Dataset] confirm Delete datasetVersion', props<{ version: DatasetVersion }>()),
    deleteVersion: createAction('[Dataset] Delete datasetVersion', props<{ version: DatasetVersion }>()),
    deleteVersionFailure: createAction('[Dataset] Delete datasetVersion failure', props<{ err: any }>())
  }
};
