import { ComponentRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { WidgetImageComponent } from '@provoly/dashboard/widgets/widget-image/component/widget-image.component';
import { hot } from 'jest-marbles';
import { WidgetFactoryService } from './widget-factory.service';

import { WidgetInstanciatorComponent } from './widget-instanciator.component';

describe('WidgetInstanciatorComponent', () => {
  let component: WidgetInstanciatorComponent;
  let fixture: ComponentFixture<WidgetInstanciatorComponent>;
  const mockWidgetFactoryService = { resolveComponent: jest.fn(() => WidgetImageComponent) };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WidgetInstanciatorComponent],
      providers: [
        { provide: WidgetFactoryService, useValue: mockWidgetFactoryService },
        provideMockStore({ initialState: {} })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetInstanciatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept widget index', () => {
    component.widgetIndex = 5;
    expect(component._widgetIndex$).toBeObservable(hot('5'));
    expect(component.widgetIndex).toEqual(5);
  });

  it('should allow to destroy created component', () => {
    component.instanciatedComponent = {
      destroy: () => {}
    } as ComponentRef<any>;
    const spy = jest.spyOn(component.instanciatedComponent, 'destroy').mockReturnValue(undefined);
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalledWith();
  });
});
