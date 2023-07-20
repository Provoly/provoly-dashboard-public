import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { routes } from '../../../admin-routing.module';
import { AdminUserEditMetadataComponent } from './admin-user-edit-metadata.component';

describe('AdminEditMetadataComponent', () => {
  let component: AdminUserEditMetadataComponent;
  let fixture: ComponentFixture<AdminUserEditMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminUserEditMetadataComponent, MockPryMetadataFormComponent],
      providers: [{ provide: PRY_ACCESS_GUARD, useClass: PryDefaultAccessGuard }, provideMockStore()],
      imports: [RouterTestingModule.withRoutes(routes)]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserEditMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
