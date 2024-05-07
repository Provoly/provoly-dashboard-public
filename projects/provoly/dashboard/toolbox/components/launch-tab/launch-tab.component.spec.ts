import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { DashboardActions, PRY_ACCESS_TOKEN, PryDefaultAccessService } from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';

import { LaunchTabComponent } from './launch-tab.component';

describe('LaunchTabComponent', () => {
  let component: LaunchTabComponent;
  let store: MockStore;
  let fixture: ComponentFixture<LaunchTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaunchTabComponent, MockTranslatePipe, MockPryIconComponent, MockI18nPipe],
      providers: [provideMockStore(), { provide: PRY_ACCESS_TOKEN, useClass: PryDefaultAccessService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchTabComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open window when clicked', () => {
    const spy = jest.spyOn(store, 'dispatch').mockReturnValue();
    component.launchNewWindow();
    expect(spy).toHaveBeenCalledWith(DashboardActions.createTab());
  });
});
