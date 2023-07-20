import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { PRY_ACCESS_GUARD, PryDefaultAccessGuard } from '@provoly/dashboard';
import { MockPryMetadataFormComponent } from '../../../../mock/components/admin/metadata/mock-pry-metadata-form.component';
import { routes } from '../../../admin-routing.module';
import { AdminEditMetadataComponent } from './admin-edit-metadata.component';

describe('AdminEditMetadataComponent', () => {
  let component: AdminEditMetadataComponent;
  let fixture: ComponentFixture<AdminEditMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminEditMetadataComponent, MockPryMetadataFormComponent],
      providers: [{ provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard }, provideMockStore({})],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEditMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
