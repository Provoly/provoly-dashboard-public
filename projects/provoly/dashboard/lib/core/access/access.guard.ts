import { Injectable, InjectionToken } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';

export abstract class PryBaseAccessGuard implements CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    throw new Error('Method not implemented.');
  }
}

export const PRY_ACCESS_GUARD = new InjectionToken<PryBaseAccessGuard>('PRY_ACCESS_GUARD');

@Injectable({ providedIn: 'root' })
export class PryDefaultAccessGuard implements PryBaseAccessGuard {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return of(true);
  }
}
