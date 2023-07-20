import { createReducer, on } from '@ngrx/store';
import { LinkDetails } from '@provoly/dashboard';
import { LinksActions } from './links.actions';

export const linksFeatureKey = '@pry/admin/links';

export interface LinkState {
  links: LinkDetails[];
  loading: boolean;
}

export const initialLinkState: LinkState = {
  links: [],
  loading: false
};

export const linkReducer = createReducer(
  initialLinkState,
  on(LinksActions.loadLinks, (state, action) => ({
    ...state,
    loading: true
  })),
  on(LinksActions.loadLinksSuccess, (state, action) => ({
    ...state,
    links: [...action.datas],
    loading: false
  })),
  on(LinksActions.loadLinksFailure, (state, action) => ({
    ...state,
    loading: false
  }))
);
