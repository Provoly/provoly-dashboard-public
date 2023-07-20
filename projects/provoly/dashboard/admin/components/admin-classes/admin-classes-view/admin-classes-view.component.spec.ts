import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { of } from 'rxjs';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { routes } from '../../../admin-routing.module';
import { AdminClassesViewComponent } from './admin-classes-view.component';

describe('AdminClassesViewComponent', () => {
  let component: AdminClassesViewComponent;
  let fixture: ComponentFixture<AdminClassesViewComponent>;
  let store: MockStore<any>;
  let overlay: Overlay;

  let mockOverlayRef = {
    backdropClick: () => of({}),
    attach: () => undefined,
    dispose: () => undefined
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminClassesViewComponent, MockTranslatePipe],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        {
          provide: Overlay,
          useValue: {
            create: () => mockOverlayRef
          }
        },
        provideMockStore({})
      ],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClassesViewComponent);
    store = TestBed.inject(MockStore);
    overlay = TestBed.inject(Overlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
