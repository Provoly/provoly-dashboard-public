import { Component, ContentChild, HostBinding, Input, TemplateRef } from '@angular/core';
import { PryStepTitleDirective } from '../step-title.directive';

@Component({
  selector: 'pry-step',
  templateUrl: './step.component.html'
})
export class PryStepComponent {
  @ContentChild(PryStepTitleDirective) stepTitleElement: PryStepTitleDirective | undefined;

  @HostBinding('class.active-step')
  isActive = false;

  stepIndex: number = 1;
  status: string = '';
  title: string = '';

  @Input() setActiveState(step: this) {
    this.isActive = step === this;
  }

  getTitleTemplateRef(): TemplateRef<any> {
    // @ts-ignore
    return this.stepTitleElement ? this.stepTitleElement.templateRef : null;
  }

  hasTemplateRef(): boolean {
    return Boolean(this.stepTitleElement);
  }
}
