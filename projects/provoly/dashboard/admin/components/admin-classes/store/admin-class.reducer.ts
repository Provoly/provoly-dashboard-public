import { createReducer, on } from '@ngrx/store';
import { AttributeExtended, Class } from '@provoly/dashboard';
import { AdminClassActions } from './admin-class.actions';

export const classesFeatureKey = '@pry/admin/classes';

export interface AdminClassState {
  loading: boolean;
  selectedClass?: Class;
  selectedAttribute?: AttributeExtended;
  interClass?: Class;
  openModal: boolean;
}

export const initialClassState: AdminClassState = {
  loading: false,
  openModal: false
};

export const classReducer = createReducer(
  initialClassState,
  on(AdminClassActions.selectClass, (state, action) => ({
    ...state,
    selectedClass: action.clazz
  })),
  on(AdminClassActions.unselectClass, (state, action) => ({
    ...state,
    selectedClass: undefined
  })),
  on(AdminClassActions.selectAttribute, (state, action) => ({
    ...state,
    selectedAttribute: action.attrExtended
  })),
  on(AdminClassActions.unselectAttribute, (state, action) => ({
    ...state,
    selectedAttribute: undefined
  })),
  on(AdminClassActions.saveInterClass, (state, action) => ({
    ...state,
    interClass: action.class
  })),
  on(AdminClassActions.saveClassSuccess, (state, action) => ({
    ...state,
    interClass: undefined
  })),
  on(AdminClassActions.back, (state) => ({
    ...state,
    interClass: undefined,
    selectedClass: undefined
  })),
  on(AdminClassActions.resetInterClass, (state) => ({
    ...state,
    interClass: undefined
  })),
  on(AdminClassActions.openModal, (state) => ({
    ...state,
    openModal: true
  })),
  on(AdminClassActions.closeModal, (state) => ({
    ...state,
    openModal: false
  })),
  on(AdminClassActions.deleteAttributeForClass, (state) => ({
    ...state,
    selectedAttribute: undefined
  }))
);
