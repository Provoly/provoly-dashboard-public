import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Action, Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { MockCdkConnectedOverlayDirective } from '../../../../mock/directive/mock-cdk-connected-overlay.directive';
import { MockCdkOverlayOriginDirective } from '../../../../mock/directive/mock-cdk-overlay-origin.directive';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { BaseToolboxAction } from '../base-toolbox/base-toolbox-action.interface';
import { BaseToolboxActionComponent } from './base-toolbox-action.component';

describe('BaseToolboxActionComponent', () => {
  let component: BaseToolboxActionComponent;
  let fixture: ComponentFixture<BaseToolboxActionComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BaseToolboxActionComponent,
        MockTranslatePipe,
        MockCdkConnectedOverlayDirective,
        MockCdkOverlayOriginDirective,
        MockPryIconComponent,
        MockI18nPipe
      ],
      providers: [provideMockStore({})]
    })
      .overrideComponent(BaseToolboxActionComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseToolboxActionComponent);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should render template with input action', async () => {
    const spy = jest.spyOn(store, 'dispatch').mockImplementation(() => {});
    component.action = {
      label: 'label',
      icon: 'icon',
      action: {} as Action
    } as BaseToolboxAction;
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.debugElement.query(By.css('.m-actions-list__item'));
    expect(element).toBeTruthy();
    element.nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });
  it('should set right connected position', () => {
    component.iconAction = true;
    expect(component.connectedPositions[0]).toEqual({
      originX: 'center',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top'
    });
  });
  it('should set right connected position', () => {
    component.iconAction = false;
    expect(component.connectedPositions[0]).toEqual({
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top'
    });
  });
  it('should render template with input action with actions', async () => {
    component.action = {
      label: 'label',
      icon: 'icon',
      actions: []
    };
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.debugElement.query(By.css('.m-actions-list__item'));
    expect(element).toBeTruthy();
    element.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const elementActive = fixture.debugElement.query(By.css('pry-icon'));
    expect(elementActive).toBeTruthy();
    expect(component.panelOpen).toEqual(true);
  });
  it('onClosePanel should change the value', async () => {
    component.panelOpen = true;
    component.onClosePanel();
    expect(component.panelOpen).toEqual(false);
  });
});
