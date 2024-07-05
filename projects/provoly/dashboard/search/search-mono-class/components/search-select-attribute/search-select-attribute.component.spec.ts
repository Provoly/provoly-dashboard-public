import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ClassSelectors, Field, FieldSelectors, FieldType } from '@provoly/dashboard';
import { SearchMonoClassSelectors } from '../../store/search-mono-class.selectors';
import { PrySearchSelectAttributeComponent } from './search-select-attribute.component';
import { mockClasses } from '@provoly/dashboard/mock/data/mockModel';

describe('PrySearchSelectAttributeComponent', () => {
  let component: PrySearchSelectAttributeComponent;
  let fixture: ComponentFixture<PrySearchSelectAttributeComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrySearchSelectAttributeComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: ClassSelectors.entities,
              value: {
                id: mockClasses
              }
            },
            {
              selector: SearchMonoClassSelectors.selectMonoClassIdSearch,
              value: 'id'
            },
            {
              selector: FieldSelectors.fields,
              value: [
                {
                  id: 'field',
                  name: 'name',
                  type: FieldType.DECIMAL
                } as Field,
                {
                  id: 'field2',
                  name: 'name',
                  type: FieldType.STRING
                } as Field
              ]
            }
          ]
        })
      ]
    })
      .overrideComponent(PrySearchSelectAttributeComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrySearchSelectAttributeComponent);
    store = TestBed.inject(MockStore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    store?.resetSelectors();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get the right class when set an id', async () => {
    component.id = 'id';
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });
});
