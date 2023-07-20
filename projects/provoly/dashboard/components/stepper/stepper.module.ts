import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PryStepTitleDirective } from './step-title.directive';
import { PryStepComponent } from './step/step.component';
import { PryStepperComponent } from './stepper.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PryStepperComponent, PryStepComponent, PryStepTitleDirective],
  exports: [PryStepperComponent, PryStepComponent, PryStepTitleDirective]
})
export class PryStepperModule {}
