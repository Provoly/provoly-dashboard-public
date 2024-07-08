import { PryImportFormComponent } from '@provoly/dashboard/import';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { PryImportCssComponent } from '../../style/css.component';
import { MockPryUploadComponent } from '@provoly/dashboard/mock/components/mock-pry-upload.component';
import { MockNgModelDirective } from '@provoly/dashboard/mock/directive/mock-ng-model.directive';
import { MockPrySelectComponent } from '@provoly/dashboard/mock/components/mock-pry-select.component';
import { MockPryCheckboxComponent } from '@provoly/dashboard/mock/components/mock-pry-checkbox.component';
import { MockPryTextEditorComponent } from '@provoly/dashboard/mock/components/mock-pry-text-editor.component';
import { MockTranslateIdPipe } from '@provoly/dashboard/mock/pipe/mock-translate-id.pipe';
import { PryI18nService } from '@provoly/dashboard';
import { MockPryI18nService } from '@provoly/dashboard/mock/service/mock-i18n.service';

describe('PryImportFormComponent', () => {
  let component: PryImportFormComponent;
  let fixture: ComponentFixture<PryImportFormComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, ReactiveFormsModule],
      declarations: [
        PryImportFormComponent,
        MockI18nPipe,
        PryImportCssComponent,
        MockPryUploadComponent,
        MockNgModelDirective,
        MockPrySelectComponent,
        MockPryCheckboxComponent,
        MockPryTextEditorComponent,
        MockTranslateIdPipe
      ],
      providers: [provideMockStore({}), { provide: PryI18nService, useClass: MockPryI18nService }]
    }).compileComponents();
    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryImportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
