import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardActions } from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockPryToggleComponent } from '../../../mock/components/mock-pry-toggle.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';

import { EditModeToggleComponent } from './edit-mode-toggle.component';

describe('EditModeToggleComponent', () => {
  let component: EditModeToggleComponent;
  let fixture: ComponentFixture<EditModeToggleComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        EditModeToggleComponent,
        MockTranslatePipe,
        MockPryIconComponent,
        MockPryToggleComponent,
        MockI18nPipe
      ],
      providers: [provideMockStore({ initialState: {} })]
    }).compileComponents();
    store = TestBed.inject(Store);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditModeToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle', () => {
    const spy = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);
    component.toggleEditionMode();
    expect(spy).toHaveBeenCalledWith(DashboardActions.toggleEditionMode({}));
  });
});
