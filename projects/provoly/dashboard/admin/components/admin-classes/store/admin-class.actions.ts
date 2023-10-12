import { createAction, props } from '@ngrx/store';
import { Attribute, AttributeExtended, Category, Class } from '@provoly/dashboard';

export const AdminClassActions = {
  updateToolbox: createAction('[Admin/Classes] Update Toolbox Class'),

  saveInterClass: createAction('[Admin/Classes] Save Inter Class', props<{ class: Class; route: string }>()),
  resetInterClass: createAction('[Admin/Classes] Reset Inter Class'),

  saveClass: createAction('[Admin/Classes] Save Class', props<{ class: Class; route: string }>()),
  saveClassSuccess: createAction('[Admin/Classes Api] Save Class Success', props<{ route: string }>()),
  saveClassFailure: createAction('[Admin/Classes Api] Save Class Failure', props<{ error: any }>()),

  saveCategory: createAction('[Admin/Classes] Save Category', props<{ category: Category }>()),
  saveCategorySuccess: createAction('[Admin/Classes Api] Save Category Success'),
  saveCategoryFailure: createAction('[Admin/Classes Api] Save Category Failure', props<{ error: any }>()),

  selectClass: createAction('[Admin/Classes] Select Class', props<{ clazz: Class }>()),
  selectClassFailure: createAction('[Admin/Classes Api] Select Class Failure', props<{ error: any }>()),

  unselectClass: createAction('[Admin/Classes] Unselect Class'),

  deleteClass: createAction('[Admin/Classes] Delete Class', props<{ id: string; route: string }>()),
  deleteClassSuccess: createAction('[Admin/Classes Api] Delete Class Success', props<{ route: string }>()),
  deleteClassFailure: createAction('[Admin/Classes Api] Delete Class Failure', props<{ error: any }>()),

  deleteAttributeForClass: createAction(
    '[Admin/Classes] Delete Attribute for Class',
    props<{ classId: string; attrId: string; backPath: string; addAttrPath: string }>()
  ),
  deleteAttributeForClassSuccess: createAction(
    '[Admin/Classes Api] Delete Attribute for Class Success',
    props<{ classId: string; backPath: string; addAttrPath: string }>()
  ),
  deleteAttributeForClassFailure: createAction(
    '[Admin/Classes Api] Delete Attribute for Class Failure',
    props<{ error: any }>()
  ),

  selectAttribute: createAction(
    '[Admin/Classes] Select current Attribute',
    props<{ attrExtended: AttributeExtended }>()
  ),
  unselectAttribute: createAction('[Admin/Classes] Unselect current Attribute'),

  saveAttributeForClass: createAction(
    '[Admin/Classes] Save Attribute for Selected Class',
    props<{ classId: string; attribute: Attribute; route: string }>()
  ),
  saveAttributeForClassSuccess: createAction(
    '[Admin/Classes Api] Save Attribute for Selected Class Success',
    props<{ route: string }>()
  ),
  saveAttributeForClassFailure: createAction(
    '[Admin/Classes Api] Save Attribute for Selected Class Failure',
    props<{ error: any }>()
  ),
  back: createAction('[Admin/Classes] back', props<{ path: string }>()),
  openModal: createAction('[Class] Open modal'),
  closeModal: createAction('[Class] Close modal'),
  confirmClassDeletion: createAction('[Class] Open modal for deleting class', props<{ id: string; path: string }>()),
  confirmAttributeDeletion: createAction(
    '[Class] Open modal for attribute deletion',
    props<{
      classId: string;
      attrId: string;
      backPath: string;
      addAttrPath: string;
    }>()
  ),
  getStorageOptions: createAction('[Admin/Classes] Get Storage Options List'),
  getStorageOptionsSuccess: createAction(
    '[Admin/Classes] Get Storage Options List Success',
    props<{ storageOptions: string[] }>()
  ),
  getStorageOptionsFailure: createAction('[Admin/Classes] Get Storage Options List Failure', props<{ error: any }>())
};
