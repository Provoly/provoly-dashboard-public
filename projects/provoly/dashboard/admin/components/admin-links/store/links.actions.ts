import { createAction, props } from '@ngrx/store';
import { Link, LinkDetails } from '@provoly/dashboard';

export const LinksActions = {
  loadLinks: createAction('[Admin/Links] Load Links'),
  loadLinksSuccess: createAction('[Admin/Links Api] Load Links Success', props<{ datas: LinkDetails[] }>()),
  loadLinksFailure: createAction('[Admin/Links Api] Load Links Failure', props<{ error: any }>()),

  saveLink: createAction('[Admin/Links] Save Links', props<{ link: Link; route: string }>()),
  saveLinkSuccess: createAction('[Admin/Links Api] Save Links Success', props<{ route: string }>()),
  saveLinkFailure: createAction('[Admin/Links Api] Save Links Failure', props<{ error: any }>())
};
