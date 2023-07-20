import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PryStepTitleDirective } from './step-title.directive';
import { PryStepComponent } from './step/step.component';
import { PryStepperComponent, Status } from './stepper.component';

@Component({
  template: `<pry-stepper>
    <pry-step
      ><h1 *stepTitle>Titre 1</h1>
      <p>content 1</p></pry-step
    >
    <pry-step
      ><h1 *stepTitle>Titre 2</h1>
      <p>content 2</p></pry-step
    >
  </pry-stepper>`
})
class FakeComponent {}

describe('StepperComponent', () => {
  let component: PryStepperComponent;
  let fixture: ComponentFixture<FakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PryStepperComponent, PryStepComponent, PryStepTitleDirective, FakeComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(FakeComponent);
    component = fixture.debugElement.query(By.css('pry-stepper')).componentInstance;
    fixture.detectChanges();
  });

  it('First step should be active', () => {
    const steps = component.steps.toArray();
    expect(component.steps.length).toBe(2);
    expect(steps[0].isActive).toBeTruthy();
    expect(steps[0].status).toBe(Status.IN_PROGRESS);
    expect(steps[1].isActive).toBeFalsy();
    expect(steps[1].status).toBe(Status.PENDING);
  });

  it('Status should be completed when next is called', () => {
    let circle = fixture.debugElement.query(By.css('.m-stepper-item__count')).nativeElement;
    expect(circle.classList).toContain('-active');
    expect(circle.classList.contains('-active')).toBeTruthy();
    component.next();
    const steps = component.steps.toArray();
    expect(steps[0].isActive).toBeFalsy();
    expect(steps[0].status).toBe(Status.COMPLETED);
    expect(steps[1].isActive).toBeTruthy();
    expect(steps[1].status).toBe(Status.IN_PROGRESS);
  });

  it('Event is emitted when stepper is completed', () => {
    const spy = jest.spyOn(component.lastStepCompleted, 'emit');
    component.next();
    component.next();
    const steps = component.steps.toArray();
    expect(steps[1].status).toBe(Status.COMPLETED);
    expect(steps[1].status).toBe(Status.COMPLETED);
    expect(spy).toHaveBeenCalled();
  });

  it('Status should be completed when prev is called', () => {
    component.next();
    component.prev();
    const steps = component.steps.toArray();
    expect(steps[0].isActive).toBeTruthy();
    expect(steps[0].status).toBe(Status.IN_PROGRESS);
    expect(steps[1].isActive).toBeFalsy();
    expect(steps[1].status).toBe(Status.PENDING);
  });

  it('Should change last step status to in progress when stepper is completed', () => {
    component.next();
    component.next();
    const steps = component.steps.toArray();
    expect(steps[1].isActive).toBeTruthy();
    expect(steps[1].status).toBe(Status.COMPLETED);
    component.prev();
    expect(steps[1].isActive).toBeTruthy();
    expect(steps[1].status).toBe(Status.IN_PROGRESS);
  });

  it('Call to goTo after steps is completed', () => {
    const spy = jest.spyOn(component, 'goTo');
    component.next();
    const steps = component.steps.toArray();
    expect(steps[1].isActive).toBeTruthy();
    const circle = fixture.debugElement.query(By.css('.m-stepper-item'));
    circle.nativeElement.click();
    expect(spy).toHaveBeenCalled();
    expect(steps[0].isActive).toBeTruthy();
  });

  it('Call to goTo when step is pending do nothing', () => {
    const steps = component.steps.toArray();
    component.goTo(1);
    expect(steps[0].isActive).toBeTruthy();
  });

  it('ALl steps should be completed or in progress in consult mode', () => {
    component.isConsultMode = true;
    component.ngAfterContentInit();
    const steps = component.steps.toArray();
    expect(steps[0].status).toBe(Status.IN_PROGRESS);
    expect(steps[1].status).toBe(Status.COMPLETED);
  });
});
