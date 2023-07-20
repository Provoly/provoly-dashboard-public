import { Directive, Inject, Input, OnDestroy, Optional, TemplateRef, ViewContainerRef } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { PryAccessCheck } from './access.model';
import { PRY_ACCESS_TOKEN, PryBaseAccess } from './access.service';

@Directive({ selector: '[pryAccess]' })
export class PryAccessDirective implements OnDestroy {
  private hasRoleSub?: Subscription;
  private isRender = false;

  @Input('pryAccess') set authorizedRoles(accessCheck: PryAccessCheck) {
    const rolesOk$ =
      this.role?.hasRole(accessCheck.roles, accessCheck.module, accessCheck.page, accessCheck.action) ?? of(true);
    this.hasRoleSub?.unsubscribe();
    this.hasRoleSub = rolesOk$.subscribe((val) => {
      if (val && !this.isRender) {
        this.vcr.createEmbeddedView(this.template);
        this.isRender = true;
      } else if (!val && this.isRender) {
        this.vcr.clear();
        this.isRender = false;
      }
    });
  }

  constructor(
    private template: TemplateRef<any>,
    private vcr: ViewContainerRef,
    @Optional() @Inject(PRY_ACCESS_TOKEN) private role: PryBaseAccess
  ) {}

  ngOnDestroy(): void {
    this.hasRoleSub?.unsubscribe();
  }
}
