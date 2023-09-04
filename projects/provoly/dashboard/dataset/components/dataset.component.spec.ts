import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DashboardActions, ManifestDescription, PryVisibilityType, ViewMode } from '@provoly/dashboard';
import { MockPryIconComponent } from '@provoly/dashboard/mock/components/mock-pry-icon.component';
import { MockPryShareComponent } from '@provoly/dashboard/mock/components/mock-pry-share.component';
import { MockNgModelDirective } from '@provoly/dashboard/mock/directive/mock-ng-model.directive';
import { MockPryAccessDirective } from '@provoly/dashboard/mock/directive/mock-pry-access.directive';
import { MockPryTooltipDirective } from '@provoly/dashboard/mock/directive/mock-pry-tooltip.directive';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockPryPresentationCssComponent } from '@provoly/dashboard/mock/style/mock-pry-presentation-css';
import { PryPresentationComponent } from '@provoly/dashboard/presentation';
import { combineLatest, map, of } from 'rxjs';

describe('PryPresentationComponent', () => {
  let component: PryPresentationComponent;
  let fixture: ComponentFixture<PryPresentationComponent>;
  let store: MockStore;
  let overlay: Overlay;

  const presentation = {
    id: '1',
    name: 'presentation 1',
    description: 'test-presentation',
    visibility: { type: PryVisibilityType.PRIVATE }
  } as ManifestDescription;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PryPresentationComponent,
        MockI18nPipe,
        MockPryIconComponent,
        MockPryPresentationCssComponent,
        MockPryTooltipDirective,
        MockPryShareComponent,
        MockNgModelDirective,
        MockPryAccessDirective
      ],
      providers: [provideMockStore({}), { provide: Overlay }]
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
    component.selectedPresentation = {
      id: '1',
      name: 'presentation 1',
      description: 'test-presentation'
    } as ManifestDescription;
    component.selectedMode = ViewMode.CONSULT;
    component.closeRestitution();
    expect(component.selectedPresentation).toBeNull();
    expect(component.selectedMode).toEqual(ViewMode.CATALOG);
  });
  it('should fetch is called', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.fetch(presentation);
    expect(spy).toHaveBeenCalledWith(DashboardActions.fetchStaticManifest({ id: presentation.id }));
    expect(spy).toHaveBeenCalledWith(DashboardActions.followManifestRoute());
  });
  it('should edit is called', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.edit(presentation);
    expect(component.selectedMode).toEqual(ViewMode.EDITION);
    expect(spy).toHaveBeenCalledWith(DashboardActions.fetchStaticManifest({ id: presentation.id }));
  });
  it('should delete is called', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.delete(presentation.id);
    expect(spy).toHaveBeenCalledWith(DashboardActions.deleteManifest({ id: presentation.id }));
  });
  it('should default is called', () => {
    const spy = jest.spyOn(store, 'dispatch');
    component.default(presentation.id, presentation.name);
    expect(spy).toHaveBeenCalledWith(
      DashboardActions.defaultManifest({ id: presentation.id, name: presentation.name })
    );
  });
  it('should toggle modal', () => {
    expect(component.modalOpened).toBe(false);
    component.toggleModal(presentation);
    expect(component.modalOpened).toBe(true);
    component.toggleModal(presentation);
    expect(component.modalOpened).toBe(false);
  });
  it('should filter and sort datasets alphabetically', () => {
    const mockDatasets = [{ name: 'Z named dataset' }, { name: 'A named dataset' }, { name: 'C named dataset' }];
    const mockSearch = of('a');
    const searchResult = [{ name: 'A named dataset' }];

    combineLatest([of(mockDatasets), mockSearch])
      .pipe(
        map(([datasets, search]) =>
          datasets
            .filter((dataset) => search.length === 0 || dataset.name.toLowerCase().includes(search.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name))
        )
      )
      .subscribe((res) => {
        expect(res).toEqual(searchResult);
      });
  });
});
