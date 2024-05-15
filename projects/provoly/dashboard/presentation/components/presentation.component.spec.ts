import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DashboardActions, ManifestDescription, PryTitleService, ViewMode } from '@provoly/dashboard';
import { MockPryIconComponent } from '@provoly/dashboard/mock/components/mock-pry-icon.component';
import { MockPryShareComponent } from '@provoly/dashboard/mock/components/mock-pry-share.component';
import { MockNgModelDirective } from '@provoly/dashboard/mock/directive/mock-ng-model.directive';
import { MockPryAccessDirective } from '@provoly/dashboard/mock/directive/mock-pry-access.directive';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockPryPresentationCssComponent } from '@provoly/dashboard/mock/style/mock-pry-presentation-css';
import { PryPresentationComponent } from '@provoly/dashboard/presentation';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { MockPryGroupShareComponent } from '@provoly/dashboard/mock/components/mock-pry-group-share.component';

describe('PryPresentationComponent', () => {
  let component: PryPresentationComponent;
  let fixture: ComponentFixture<PryPresentationComponent>;
  let store: MockStore;
  let overlay: Overlay;

  const presentation = {
    id: '1',
    name: 'presentation 1'
  } as ManifestDescription;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PryPresentationComponent,
        MockI18nPipe,
        MockPryIconComponent,
        MockPryPresentationCssComponent,
        MockPryGroupShareComponent,
        MockNgModelDirective,
        MockPryAccessDirective
      ],
      providers: [
        provideMockStore({}),
        { provide: Overlay },
        { provide: PryTitleService, useValue: { changeTitle: () => {} } },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              id_params: 'id_params_test'
            })
          }
        }
      ]
    }).compileComponents();
    store = TestBed.inject(MockStore);
    overlay = TestBed.inject(Overlay);
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(PryPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should test closeRestitution is called', () => {
    component.selectedPresentation$.next({
      id: '1',
      name: 'presentation 1',
      description: 'test-presentation'
    } as ManifestDescription);
    component.selectedMode = ViewMode.CONSULT;
    component.closeRestitution();
    expect(component.selectedPresentation$.value).toBeNull();
    expect(component.selectedMode).toEqual(ViewMode.CATALOG);
  });
  it('should fetch is called', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.fetch(presentation);
    expect(spy).toHaveBeenCalledWith(DashboardActions.loadPresentation({ presentation, viewMode: ViewMode.CONSULT }));
  });
  it('should edit is called', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.edit(presentation);
    expect(component.selectedMode).toEqual(ViewMode.EDITION);
    expect(spy).toHaveBeenCalledWith(DashboardActions.fetchStaticManifest({ id: presentation.id }));
  });
  it('should call confirmManifestDeletion', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.delete(presentation.id);
    expect(spy).toHaveBeenCalledWith(DashboardActions.confirmManifestDeletion({ id: presentation.id }));
  });
});
