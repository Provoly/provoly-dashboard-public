import { createAction, props } from '@ngrx/store';
import { Field } from '@provoly/dashboard';

export const FieldsActions = {
  updateToolbox: createAction('[Admin/Fields] Update Toolbox Class'),
  failure: createAction('[Admin/Fields] failure action', props<{ error: any }>()),

  saveField: createAction('[Admin/Fields] Save Field', props<{ field: Field; route: string }>()),
  saveFieldSuccess: createAction('[Admin/Fields Api] Save Field Success', props<{ route: string }>()),
  updateField: createAction('[Admin/Fields] Update Field', props<{ field: Field; route: string }>()),
  updateFieldSuccess: createAction('[Admin/Fields Api] Update Field Success', props<{ route: string }>()),
  confirmFieldDeletion: createAction(
    '[Admin/Fields] Open Modal for Deleting Field',
    props<{ id: string; path: string }>()
  ),
  deleteField: createAction('[Admin/Fields] Delete Field', props<{ id: string; route: string }>()),
  deleteFieldSuccess: createAction('[Admin/Fields] Delete Field Success'),

  selectField: createAction('[Admin/Fields] Select Field', props<{ field: Field }>()),
  unselectField: createAction('[Admin/Fields] unselect Field')
};
