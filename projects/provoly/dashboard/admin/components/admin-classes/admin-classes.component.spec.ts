import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ClassSelectors, PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { businessDatas } from '../../../mock/data/mockItemAdmin';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockSortPipe } from '../../../mock/pipe/mock-sort.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';

import { AdminClassesComponent } from './admin-classes.component';

describe('AdminClassesComponent', () => {
  let component: AdminClassesComponent;
  let fixture: ComponentFixture<AdminClassesComponent>;
  let store: MockStore<any>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminClassesComponent, MockTranslatePipe, MockSortPipe, MockI18nPipe],
      providers: [
        { provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard },
        provideMockStore({
          selectors: [
            {
              selector: ClassSelectors.classDatas,
              value: businessDatas
            }
          ]
        })
      ],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminClassesComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
