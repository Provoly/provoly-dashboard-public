import { Inject, Injectable, Optional } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {
  PRY_ACCESS_TOKEN,
  PryAccessCheck,
  PryBaseAccess,
  PryBaseAccessGuard,
  PrySnackbarService
} from '@provoly/dashboard';
import { filter, of, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PryDashboardAccessGuard implements PryBaseAccessGuard {
  constructor(
    @Optional() @Inject(PRY_ACCESS_TOKEN) private access: PryBaseAccess,
    private snackBar: PrySnackbarService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const access: PryAccessCheck = route.data['access'] ?? [];
    const isOk = this.access?.hasRole(access.roles, access.module, access.page, access.action) ?? of(true);
    isOk
      .pipe(
        take(1),
        filter((val) => !val)
      )
      .subscribe(() =>
        this.snackBar.open({
          message: "Vous n'avez pas accès à cette page",
          type: 'warning'
        })
      );
    return isOk;
  }
}
