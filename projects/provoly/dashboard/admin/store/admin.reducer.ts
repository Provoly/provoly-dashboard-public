import { createReducer, on } from '@ngrx/store';
import { Associations, BaseMenuItem, BaseToolboxAction } from '@provoly/dashboard';
import { AdminActions } from './admin.actions';

export const adminFeatureKey = '@pry/admin';

export interface AdminState {
  highlightedMenu: string;
  menus: BaseMenuItem[];
  menuOpen: boolean;
  actions: BaseToolboxAction[];
  subActions: BaseToolboxAction[];
  panelOpen: boolean;
  componentType: string | null;
  selectedAssociation: Associations | undefined;
}

export const initialAdminState: AdminState = {
  highlightedMenu: 'environment',
  menus: [
    { menu: 'classes', module: 'admin', page: 'classes', subMenu: 'model' },
    { menu: 'fields', module: 'admin', page: 'fields', subMenu: 'model' },
    { menu: 'dataset', module: 'admin', page: 'dataset', subMenu: 'model' },
    { menu: 'relation-types', module: 'admin', page: 'relation_types', subMenu: 'model' },
    { menu: 'links', module: 'admin', page: 'links', subMenu: 'model' },
    { menu: 'metadata', module: 'admin', page: 'metadata', subMenu: 'model' },
    { menu: 'metadata-rules', module: 'admin', page: 'metadata_rules', subMenu: 'model' },
    { menu: 'user', module: 'admin', page: 'user', subMenu: 'access' },
    { menu: 'metadata-user', module: 'admin', page: 'metadata_user', subMenu: 'access' },
    { menu: 'environment', module: 'admin', page: 'environment', subMenu: 'access' },
    { menu: 'predicates', module: 'admin', page: 'predicates', subMenu: 'access' },
    { menu: 'abac-rules', module: 'admin', page: 'abac_rules', subMenu: 'access' }
  ],
  menuOpen: true,
  actions: [],
  subActions: [],
  panelOpen: true,
  componentType: null,
  selectedAssociation: undefined
};

export const adminReducer = createReducer(
  initialAdminState,
  on(AdminActions.highlightMenu, (state, action) => ({
    ...state,
    highlightedMenu: action.menu
  })),
  on(AdminActions.toggleMenu, (state) => ({
    ...state,
    menuOpen: !state.menuOpen
  })),
  on(AdminActions.resetActions, (state) => ({
    ...state,
    actions: [],
    subActions: [],
    componentType: null
  })),
  on(AdminActions.mainActions, (state, action) => ({
    ...state,
    actions: [...action.actions]
  })),
  on(AdminActions.subActions, (state, action) => ({
    ...state,
    subActions: [...action.actions]
  })),
  on(AdminActions.togglePanel, (state, action) => {
    if (!action.panelOpen) {
      return { ...state, panelOpen: action.panelOpen, componentType: null };
    }
    return { ...state, panelOpen: action.panelOpen };
  }),
  on(AdminActions.selectComponentType, (state, action) => ({
    ...state,
    componentType: action.componentType
  })),
  on(AdminActions.fetchAssociationsSuccess, (state, action) => ({
    ...state,
    selectedAssociation: action.association
  }))
);
