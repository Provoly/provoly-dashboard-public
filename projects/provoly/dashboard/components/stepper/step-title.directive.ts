import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[stepTitle]' })
export class PryStepTitleDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
