import { Injectable } from '@angular/core';
import { PryAccess, PryAccessUtils, PryBaseAccess } from '@provoly/dashboard';
import { Observable, of } from 'rxjs';
import { ACCESS } from './access.interface';
import { AuthExampleService } from './auth-example.service';

@Injectable({ providedIn: 'root' })
export class PryDashboardRoleService extends PryBaseAccess {
  access: PryAccess = ACCESS;
  constructor(private authService: AuthExampleService) {
    super();
  }

  override hasRole(
    authorizedRoles?: string[],
    moduleKey?: string,
    pageKey?: string,
    actionKey?: string
  ): Observable<boolean> {
    const roles = this.authService.getRoles() ?? [];
    if (authorizedRoles) {
      return of(PryAccessUtils.rolesIntersect(roles, authorizedRoles));
    }

    return of(PryAccessUtils.notExistsAllowStrategy(roles, this.access, moduleKey, pageKey, actionKey));
  }
}
