import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PryPaginatorComponent } from '@provoly/dashboard/components/paginator/paginator.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Action } from '@ngrx/store';
import { PryPaginatorCssComponent } from '@provoly/dashboard/components/paginator/style/css.component';
import { MockPryIconComponent } from '@provoly/dashboard/mock/components/mock-pry-icon.component';
import { DataSourceActions } from '@provoly/dashboard';
import { input } from '@angular/core';

describe('PaginatorComponent', () => {
  let component: PryPaginatorComponent;
  let fixture: ComponentFixture<PryPaginatorComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PryPaginatorComponent, PryPaginatorCssComponent, MockPryIconComponent],
      providers: [provideMockStore({})]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have values set by default', () => {
    expect(component.nbPerPage()).toBe(10);
    expect(component.totalItemNb()).toBe(100);
    expect(component.mode()).toBe('long');

    expect(component.nbOfPages()).toBe(10); // totalItemNb divided by nbPerPage
    expect(component.pages()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('should dispatch page change action when currentPage is set', () => {
    // example action that uses pagination
    const action = DataSourceActions.dataset.listVersions({});
    component.action = input<Action | undefined>(action);
    fixture.detectChanges();

    const spy = jest.spyOn(store, 'dispatch');

    component.currentPage.set(2);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({
      ...action,
      offset: 10,
      limit: 10
    });
  });

  it('should dispatch store action to load data for selected page', () => {
    // example action that uses pagination
    const action = DataSourceActions.dataset.listVersions({});
    component.action = input<Action | undefined>(action);
    fixture.detectChanges();

    const spy = jest.spyOn(store, 'dispatch');

    component.currentPage.set(5);
    component.dispatchPageChangeAction();

    expect(spy).toHaveBeenCalledWith({
      ...action,
      offset: 40,
      limit: 10
    });
  });

  it('should not dispatch any store action if no action provided', () => {
    const spy = jest.spyOn(store, 'dispatch');

    component.dispatchPageChangeAction();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should set current page and emit the pageChange event when a page is clicked', () => {
    const spy = jest.spyOn(component.pageChange, 'emit');

    component.changePage(3);

    expect(component.currentPage()).toBe(3);
    expect(spy).toHaveBeenCalledWith(3);
  });
});
