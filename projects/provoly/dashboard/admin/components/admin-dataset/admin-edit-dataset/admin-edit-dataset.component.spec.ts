import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { MockPryAdminFormDatasetComponent } from '../../../../mock/components/admin/dataset/mock-pry-form-dataset.component';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';

import { AdminEditDatasetComponent } from './admin-edit-dataset.component';

describe('AdminEditDatasetComponent', () => {
  let component: AdminEditDatasetComponent;
  let fixture: ComponentFixture<AdminEditDatasetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminEditDatasetComponent, MockTranslatePipe, MockPryAdminFormDatasetComponent, MockI18nPipe],
      providers: [
        provideMockStore({}),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              id_params: 'id_params_test'
            }),
            params: of({
              id_query_params: 'id_query_params_test'
            })
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditDatasetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
