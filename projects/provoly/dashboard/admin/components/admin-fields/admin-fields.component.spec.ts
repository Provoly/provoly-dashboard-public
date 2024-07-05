import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Class, ClassSelectors, Field, FieldSelectors, FieldType } from '@provoly/dashboard';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockSortPipe } from '../../../mock/pipe/mock-sort.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { AdminFieldsComponent } from './admin-fields.component';

describe('AdminFieldsComponent', () => {
  let component: AdminFieldsComponent;
  let fixture: ComponentFixture<AdminFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AdminFieldsComponent, MockTranslatePipe, MockSortPipe, MockPryIconComponent, MockI18nPipe],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: ClassSelectors.classes,
              value: [
                {
                  id: 'class1',
                  attributes: [
                    {
                      id: 'attr1',
                      field: { id: 'field1', name: 'field1' }
                    }
                  ]
                } as Class
              ]
            },
            {
              selector: FieldSelectors.fields,
              value: [
                {
                  id: 'field1',
                  name: 'field1',
                  type: FieldType.KEYWORD
                } as Field
              ]
            }
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should create a table with one row', async () => {
    await fixture.whenStable();
    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows).toBeTruthy();
    expect(rows.length).toEqual(1);
  });
});
