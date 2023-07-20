import { PryAccess } from './access.model';

export class PryAccessUtils {
  static notExistsAllowStrategy(
    userRoles?: string[],
    accessTree?: PryAccess,
    moduleKey?: string,
    pageKey?: string,
    actionKey?: string
  ): boolean {
    const module = moduleKey && accessTree?.modules?.[moduleKey];
    if (module) {
      const moduleRoles = module.roles;
      if (moduleRoles) {
        const moduleKo = !this.rolesIntersect(userRoles, moduleRoles);
        if (moduleKo) return false;
      }
      const page = pageKey && module?.pages?.[pageKey];
      if (page) {
        const pageRoles = page.roles;
        if (pageRoles) {
          const pageKo = !this.rolesIntersect(userRoles, pageRoles);
          if (pageKo) return false;
        }
        const action = actionKey && page?.actions?.[actionKey];
        if (action) {
          const actionKo = !this.rolesIntersect(userRoles, action);
          if (actionKo) return false;
        }
      }
    }
    return true;
  }

  static notExistsBlockStrategy(
    userRoles?: string[],
    accessTree?: PryAccess,
    moduleKey?: string,
    pageKey?: string,
    actionKey?: string
  ): boolean {
    const module = moduleKey && accessTree?.modules?.[moduleKey];
    if (moduleKey && module) {
      const moduleRoles = module.roles;
      if (moduleRoles) {
        const moduleKo = !this.rolesIntersect(userRoles, moduleRoles);
        if (moduleKo) return false;
      } else {
        return false;
      }
      const page = pageKey && module?.pages?.[pageKey];
      if (pageKey && page) {
        const pageRoles = page.roles;
        if (pageRoles) {
          const pageKo = !this.rolesIntersect(userRoles, pageRoles);
          if (pageKo) return false;
        } else {
          return false;
        }
        const action = actionKey && page?.actions?.[actionKey];
        if (actionKey && action) {
          const actionKo = !this.rolesIntersect(userRoles, action);
          if (actionKo) return false;
        } else if (!actionKey) {
          return true;
        } else {
          return false;
        }
      } else if (!pageKey) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }

  static rolesIntersect(userRoles?: string[], roles?: string[]) {
    if (!userRoles || !roles) return false;
    return userRoles.find((role) => roles?.includes(role)) !== undefined;
  }
}
