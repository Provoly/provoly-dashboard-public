export interface PryAccessCheck {
  roles?: string[];
  module?: string;
  page?: string;
  action?: string;
  subMenu?: string;
}

export interface PryAccess {
  modules?: { [key: string]: PryAccessModule };
}

export interface PryAccessModule {
  roles?: string[];
  pages?: { [key: string]: PryAccessPage };
}

export interface PryAccessPage {
  roles?: string[];
  actions?: { [key: string]: string[] };
}
