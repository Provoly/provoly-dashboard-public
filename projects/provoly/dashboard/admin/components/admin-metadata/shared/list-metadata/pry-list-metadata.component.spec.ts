import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { IMetadata, PrySortModule, VARIABLE_TYPE } from '@provoly/dashboard';
import { MockPryCheckboxComponent } from '../../../../../mock/components/mock-pry-checkbox.component';
import { MockPryIconComponent } from '../../../../../mock/components/mock-pry-icon.component';
import { MockPryModalComponent } from '../../../../../mock/components/mock-pry-modal.component';
import { MockPrySelectComponent } from '../../../../../mock/components/mock-pry-select.component';
import { MockI18nPipe } from '../../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../../mock/pipe/mock-translate.pipe';
import { MetadataSelectors } from '../../store/metadata.selector';
import { IConfigHeader, PryListMetadataComponent } from './pry-list-metadata.component';

const metadata: Array<IMetadata> = [
  {
    id: '9d9aba2c-fc3a-44d7-a508-287ad2d8cbb0',
    name: '_class',
    type: VARIABLE_TYPE.UUID
  },
  {
    id: 'e1e55abd-2fb7-4e3b-9372-92c7c9d6c5c4',
    name: '_date_modification',
    type: VARIABLE_TYPE.DATE
  },
  {
    id: 'ba681f33-fe70-42f8-a277-05c607ba29cf',
    name: 'vigipirate',
    type: VARIABLE_TYPE.INTEGER
  }
];

const configHeader: Array<IConfigHeader> = [
  { headerType: 'label', label: 'FIRST' },
  {
    headerType: 'label',
    label: 'SECOND'
  }
];

describe('ListMetadataComponent', () => {
  let component: PryListMetadataComponent;
  let fixture: ComponentFixture<PryListMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PryListMetadataComponent,
        MockTranslatePipe,
        MockPrySelectComponent,
        MockPryCheckboxComponent,
        MockPryModalComponent,
        MockPryIconComponent,
        MockI18nPipe
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: MetadataSelectors.metadata,
              value: metadata
            }
          ]
        })
      ],
      imports: [FormsModule, PrySortModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryListMetadataComponent);
    component = fixture.componentInstance;
    component.metadata = metadata;
    component.configHeader = configHeader;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a table with correct number header label', () => {
    const headers = fixture.debugElement.queryAll(By.css('thead > tr > th'));
    expect(headers.length).toEqual(3);
    expect(fixture.debugElement.query(By.css('thead')).nativeElement.textContent.trim()).toEqual('FIRSTSECOND');
  });

  it('should display 3 metadata', () => {
    const tr = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(tr.length).toEqual(metadata.length);
  });
});
