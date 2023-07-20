import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import {
  ConfigActions,
  PRY_ACCESS_GUARD,
  PryDefaultAccessGuard,
  RelationTypesActions,
  RelationTypesSelectors
} from '@provoly/dashboard';
import { of } from 'rxjs';
import { relationTypes } from '../../../../mock/data/mockItemAdmin';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { AdminRelationTypesModalComponent } from './admin-relation-types-modal.component';

jest.mock('uuid', () => ({ v4: () => 'linkId' }));

describe('AdminLinkModalComponent', () => {
  let component: AdminRelationTypesModalComponent;
  let fixture: ComponentFixture<AdminRelationTypesModalComponent>;
  let store: MockStore<AdminRelationTypesModalComponent>;
  let overlay: Overlay;

  let mockOverlayRef = {
    backdropClick: () => of({}),
    attach: () => undefined,
    dispose: () => undefined
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminRelationTypesModalComponent, MockTranslatePipe],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: RelationTypesSelectors.relationsTypes,
              value: relationTypes
            }
          ]
        }),
        {
          provide: Overlay,
          useValue: {
            create: () => mockOverlayRef
          }
        }
      ],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRelationTypesModalComponent);
    store = TestBed.inject(MockStore);
    overlay = TestBed.inject(Overlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create new link', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');

    component.relationTypeForm.patchValue({ name: 'toto' });
    expect(component.relationTypeForm.valid).toEqual(true);
    component.addRelationType();
    expect(spyStore.mock.calls).toEqual([
      [RelationTypesActions.saveRelationType({ id: 'uuiduuid-this-isis-mock-eduuiduuidaa', name: 'toto' })],
      [RelationTypesActions.closeModal()],
      [ConfigActions.closeOverlay({ id: 'AdminRelationTypesModalComponent' })]
    ]);
  }));

  it('should close modal', fakeAsync(() => {
    const spyStore = jest.spyOn(store, 'dispatch');

    component.relationTypeForm.patchValue({ name: 'toto' });
    component.closeModal();

    expect(component.relationTypeForm.value.name).toEqual('toto');
    expect(spyStore.mock.calls).toEqual([
      [RelationTypesActions.closeModal()],
      [ConfigActions.closeOverlay({ id: 'AdminRelationTypesModalComponent' })]
    ]);
  }));
});
