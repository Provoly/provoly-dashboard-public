import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PryI18nService } from '@provoly/dashboard';
import { MockPrySelectComponent } from '../../mock/components/mock-pry-select.component';
import { MockPryUploadComponent } from '../../mock/components/mock-pry-upload.component';
import { MockNgModelDirective } from '../../mock/directive/mock-ng-model.directive';
import { MockI18nPipe } from '../../mock/pipe/mock-i18n.pipe';
import { PryImportCssComponent } from '../style/css.component';
import { PryImportComponent } from './import.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockPryCheckboxComponent } from '../../mock/components/mock-pry-checkbox.component';
import { MockPryTextEditorComponent } from '../../mock/components/mock-pry-text-editor.component';
import { MockTranslateIdPipe } from '../../mock/pipe/mock-translate-id.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('PryImportComponent', () => {
  let component: PryImportComponent;
  let fixture: ComponentFixture<PryImportComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [
        PryImportComponent,
        MockI18nPipe,
        PryImportCssComponent,
        MockPryUploadComponent,
        MockNgModelDirective,
        MockPrySelectComponent,
        MockPryCheckboxComponent,
        MockPryTextEditorComponent,
        MockTranslateIdPipe
      ],
      providers: [provideMockStore({}), { provide: PryI18nService }]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
