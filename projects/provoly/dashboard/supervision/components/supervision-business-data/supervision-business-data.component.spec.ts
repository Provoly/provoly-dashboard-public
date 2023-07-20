import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockSortPipe } from '../../../mock/pipe/mock-sort.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { SupervisionBusinessDataComponent } from './supervision-business-data.component';

describe('SupervisionBusinessDataComponent', () => {
  let component: SupervisionBusinessDataComponent;
  let fixture: ComponentFixture<SupervisionBusinessDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SupervisionBusinessDataComponent,
        MockPryIconComponent,
        MockTranslatePipe,
        MockSortPipe,
        MockI18nPipe
      ],
      providers: [provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisionBusinessDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
