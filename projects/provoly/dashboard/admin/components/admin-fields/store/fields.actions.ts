import { createAction, props } from '@ngrx/store';
import { Field } from '@provoly/dashboard';

export const FieldsActions = {
  updateToolbox: createAction('[Admin/Fields] Update Toolbox Class'),

  saveField: createAction('[Admin/Fields] Save Field', props<{ field: Field; route: string }>()),
  saveFieldSuccess: createAction('[Admin/Fields Api] Save Field Success', props<{ route: string }>()),
  saveFieldFailure: createAction('[Admin/Fields Api] Save Field Failure', props<{ error: any }>()),

  selectField: createAction('[Admin/Fields] Select Field', props<{ field: Field }>()),
  unselectField: createAction('[Admin/Fields] unselect Field'),
  confirmFieldDeletion: createAction(
    '[Admin/Fields] Open Modal for Deleting Field',
    props<{ id: string; path: string }>()
  ),
  deleteField: createAction('[Admin/Fields] Delete Field', props<{ id: string; route: string }>()),
  deleteFieldSuccess: createAction('[Admin/Fields] Delete Field Success'),
  deleteFieldFailure: createAction('[Admin/Fields] Delete Field Failure', props<{ error: any }>())
};
