import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { MockTranslatePipe } from '../../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../../admin-routing.module';
import { AdminActions } from '../../../../store/admin.actions';
import { AdminClassActions } from '../../store/admin-class.actions';
import { AdminAttributesSelectComponent } from './admin-attributes-select.component';

describe('AdminClassesSelectComponent', () => {
  let component: AdminAttributesSelectComponent;
  let fixture: ComponentFixture<AdminAttributesSelectComponent>;
  let store: MockStore<any>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminAttributesSelectComponent, MockTranslatePipe],
      providers: [{ provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard }, provideMockStore({})],
      imports: [RouterTestingModule.withRoutes(routes), DragDropModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAttributesSelectComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close panel and dispatch action', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');
    component.closePanel();
    expect(spyStore.mock.calls).toEqual([
      [AdminClassActions.unselectAttribute()],
      [AdminActions.togglePanel({ panelOpen: false })]
    ]);
  }));
});
