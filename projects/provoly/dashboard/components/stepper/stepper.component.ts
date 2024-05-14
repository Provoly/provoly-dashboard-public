import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import { PryStepComponent } from './step/step.component';

export enum Status {
  PENDING = 'pending',
  IN_PROGRESS = 'in progress',
  COMPLETED = 'completed'
}

@Component({
  selector: 'pry-stepper',
  templateUrl: './stepper.component.html'
})
export class PryStepperComponent implements AfterContentInit, AfterViewInit {
  activeIndex: number = 0;
  // @ts-ignore
  @ContentChildren(PryStepComponent) public steps: QueryList<PryStepComponent>;
  // @ts-ignore
  @ViewChildren('vc', { read: ViewContainerRef }) stepViewRef: Array<ViewContainerRef>;
  @Input() isConsultMode: boolean = false;
  @Output() lastStepCompleted: EventEmitter<void> = new EventEmitter<void>();
  @Output() activeIndexChange: EventEmitter<number> = new EventEmitter<number>();

  get stepperSteps(): PryStepComponent[] {
    return this.steps.toArray();
  }

  ngAfterContentInit() {
    this.steps.forEach((step, index) => {
      step.stepIndex = index;
      if (this.isConsultMode) {
        step.status = index === this.activeIndex ? Status.IN_PROGRESS : Status.COMPLETED;
      } else {
        step.status = index === this.activeIndex ? Status.IN_PROGRESS : Status.PENDING;
      }
      if (index === this.activeIndex) {
        step.setActiveState(step);
      }
    });
  }

  ngAfterViewInit(): void {
    this.stepViewRef.forEach((vcr, index) => {
      const step = this.steps.toArray()[index];
      if (step.hasTemplateRef()) {
        vcr.createEmbeddedView(step.getTitleTemplateRef());
        vcr.get(0)?.detectChanges();
      }
    });
  }

  updateActiveStep(index: number) {
    this.activeIndex = index;
    this.steps.forEach((step) => (step.isActive = false));
    this.stepperSteps[index].setActiveState(this.stepperSteps[index]);
    this.activeIndexChange.emit(index);
  }

  completeLastStep() {
    this.stepperSteps[this.activeIndex].status = Status.COMPLETED;
    this.lastStepCompleted.emit();
  }

  undoLastComplete() {
    this.stepperSteps[this.activeIndex].status = Status.IN_PROGRESS;
  }

  switchStatusNext(index: number): void {
    this.stepperSteps[this.activeIndex - 1].status = Status.COMPLETED;
    this.stepperSteps[index].status = Status.IN_PROGRESS;
  }

  switchStatusPrev(index: number) {
    this.stepperSteps[this.activeIndex + 1].status = Status.PENDING;
    this.stepperSteps[index].status = Status.IN_PROGRESS;
  }

  next() {
    if (this.activeIndex === this.steps.length - 1 && this.stepperSteps[this.activeIndex].status !== Status.COMPLETED) {
      this.completeLastStep();
    }

    if (this.activeIndex < this.steps.length - 1) {
      this.updateActiveStep(this.activeIndex + 1);
      this.switchStatusNext(this.activeIndex);
    }
  }

  prev() {
    if (this.activeIndex === this.steps.length - 1 && this.stepperSteps[this.activeIndex].status === Status.COMPLETED) {
      this.undoLastComplete();
      return;
    }
    if (this.activeIndex > 0) {
      this.updateActiveStep(this.activeIndex - 1);
      this.switchStatusPrev(this.activeIndex);
    }
  }

  goTo(index: number) {
    if (
      this.stepperSteps[index].status === Status.COMPLETED ||
      this.stepperSteps[index].status === Status.IN_PROGRESS
    ) {
      this.stepperSteps[this.activeIndex].status = Status.COMPLETED;
      this.updateActiveStep(index);
      this.updateActiveStep(this.activeIndex);
      this.stepperSteps[index].status = Status.IN_PROGRESS;
    }
  }
}
