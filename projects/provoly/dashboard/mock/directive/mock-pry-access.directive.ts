// noinspection AngularMissingOrInvalidDeclarationInModule

import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({ selector: '[pryAccess]' })
export class MockPryAccessDirective implements OnInit {
  @Input() pryAccess: any;

  constructor(
    private template: TemplateRef<any>,
    private vcr: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.vcr.createEmbeddedView(this.template);
  }
}
