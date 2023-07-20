import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockPryAccessDirective } from '../../../mock/directive/mock-pry-access.directive';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { Infrastructure } from '../../store/supervision-api.model';
import { SupervisionActions } from '../../store/supervision.actions';
import { SupervisionSelectors } from '../../store/supervision.selectors';
import { SupervisionInfrastructuresComponent } from './supervision-infrastructures.component';

describe('SupervisionInfrastructuresComponent', () => {
  let component: SupervisionInfrastructuresComponent;
  let fixture: ComponentFixture<SupervisionInfrastructuresComponent>;
  let store: MockStore<any>;

  const infra: Infrastructure = {
    hotScale: true,
    replicas: 1,
    available: 1,
    maxReplicas: 10,
    minReplicas: 0,
    missing: false,
    name: 'name',
    title: 'name'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SupervisionInfrastructuresComponent,
        MockPryIconComponent,
        MockTranslatePipe,
        MockPryAccessDirective,
        MockI18nPipe
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: SupervisionSelectors.loading,
              value: false
            },
            {
              selector: SupervisionSelectors.infrastructures,
              value: [infra]
            },
            {
              selector: SupervisionSelectors.lastInfraScale,
              value: null
            }
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisionInfrastructuresComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should scale up', async () => {
    const spyScaleUp = jest.spyOn(component, 'onScaleUp');
    const spyStore = jest.spyOn(store, 'dispatch');
    await fixture.whenStable();
    const icon = fixture.debugElement.query(By.css('.scale-up'));
    icon.nativeElement.click();
    expect(spyScaleUp.mock.calls).toEqual([['name', 1]]);
    expect(spyStore.mock.calls).toEqual([[SupervisionActions.scaleInfra({ name: 'name', scale: 2, up: true })]]);
  });
  it('should scale down', async () => {
    const spyScaleDown = jest.spyOn(component, 'onScaleDown');
    const spyStore = jest.spyOn(store, 'dispatch');
    await fixture.whenStable();
    const icons = fixture.debugElement.query(By.css('.scale-down'));
    icons.nativeElement.click();
    expect(spyScaleDown.mock.calls).toEqual([['name', 1]]);
    expect(spyStore.mock.calls).toEqual([[SupervisionActions.scaleInfra({ name: 'name', scale: 0, up: false })]]);
  });
});
