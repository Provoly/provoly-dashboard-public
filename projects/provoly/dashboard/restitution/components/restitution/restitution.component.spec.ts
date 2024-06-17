import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PryI18nService, ToolboxMenuService } from '@provoly/dashboard';
import { MockPryDatasourceSelectorComponent } from '@provoly/dashboard/mock/components/mock-pry-datasource-selector.component';
import { MockPryIconComponent } from '@provoly/dashboard/mock/components/mock-pry-icon.component';
import { MockPrySelectComponent } from '@provoly/dashboard/mock/components/mock-pry-select.component';
import { MockPryShareComponent } from '@provoly/dashboard/mock/components/mock-pry-share.component';
import { MockPryStepComponent } from '@provoly/dashboard/mock/components/mock-pry-step.component';
import { MockPryStepperComponent } from '@provoly/dashboard/mock/components/mock-pry-stepper.component';
import { MockPryWidgetInstanciatorComponent } from '@provoly/dashboard/mock/components/mock-pry-widget-instanciator.component';
import { MockNgModelDirective } from '@provoly/dashboard/mock/directive/mock-ng-model.directive';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '@provoly/dashboard/mock/pipe/mock-translate.pipe';
import { MockPryRestitutionListCssComponent } from '@provoly/dashboard/mock/style/mock-pry-restitution-css';
import { PryRestitutionComponent } from '@provoly/dashboard/restitution';
import { of } from 'rxjs';
import { MockPryI18nService } from '@provoly/dashboard/mock/service/mock-i18n.service';
import { MockOverlay } from '@provoly/dashboard/mock/service/mock-overlay.service';

describe('PryRestitution', () => {
  let component: PryRestitutionComponent;
  let fixture: ComponentFixture<PryRestitutionComponent>;
  let store: MockStore;
  let service: ToolboxMenuService;
  let mockToolboxMenuService = {
    menuStructure$: of([
      {
        sub: [
          { type: 'model', id: 'id1' },
          { type: 'not-model', id: 'id2' }
        ]
      }
    ]),
    types$: of([])
  };
  let form: { selectedDataSources: any; selectedWidget?: string; title?: string; image?: string; description?: string };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PryRestitutionComponent,
        MockTranslatePipe,
        MockI18nPipe,
        MockPryShareComponent,
        MockPryRestitutionListCssComponent,
        MockPryStepperComponent,
        MockPryStepComponent,
        MockPryIconComponent,
        MockPryWidgetInstanciatorComponent,
        MockPrySelectComponent,
        MockNgModelDirective,
        MockPryDatasourceSelectorComponent
      ],
      providers: [
        provideMockStore({}),
        MockTranslatePipe,
        MockI18nPipe,
        { provide: PryI18nService, useClass: MockPryI18nService },
        { provide: ToolboxMenuService, useValue: mockToolboxMenuService },
        { provide: Overlay, useValue: MockOverlay }
      ]
    }).compileComponents();
    service = TestBed.inject(ToolboxMenuService);
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryRestitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    form = {
      selectedWidget: '',
      selectedDataSources: [],
      title: '',
      image: '',
      description: ''
    };
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
