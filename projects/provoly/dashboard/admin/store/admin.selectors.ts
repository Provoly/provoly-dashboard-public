import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SubMenu } from '@provoly/dashboard';
import * as fromAdmin from './admin.reducer';

const feature = createFeatureSelector<fromAdmin.AdminState>(fromAdmin.adminFeatureKey);

const highlightedMenu = createSelector(feature, (state) => state?.highlightedMenu);
const menuOpen = createSelector(feature, (state) => state.menuOpen);
const menus = createSelector(feature, (state) => state?.menus);
const actions = createSelector(feature, (state) => state.actions);
const subActions = createSelector(feature, (state) => state.subActions);
const panelOpen = createSelector(feature, (state) => state.panelOpen);
const componentType = createSelector(feature, (state) => state?.componentType);
const subMenus = createSelector(
  feature,
  (state) =>
    state?.menus.reduce((p: SubMenu[], c) => {
      const key = c.subMenu ?? 'none';
      let menu = p.find((menu) => menu.name === key);
      if (!menu) {
        menu = { name: c.subMenu, subMenus: [], icon: c.subMenu === 'model' ? 'data' : 'shield-lock' } as SubMenu;
        p.push(menu);
      }
      menu.subMenus.push(c);
      return p;
    }, []) as SubMenu[]
);
const selectedAssociation = createSelector(feature, (state) => state?.selectedAssociation);

export const AdminSelectors = {
  feature,
  highlightedMenu,
  menuOpen,
  menus,
  subMenus,
  actions,
  subActions,
  panelOpen,
  componentType,
  selectedAssociation
};
