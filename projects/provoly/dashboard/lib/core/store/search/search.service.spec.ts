import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { SearchService } from './search.service';
import { HttpParams } from '@angular/common/http';
import { FilterParamEncoder } from '@provoly/dashboard';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideMockStore({})]
    });
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getItemsFilter should encode params values depending on operator', () => {
    service.filters = {
      datasourceid: [
        {
          attribute: 'attributeId',
          operator: 'CONTAINS',
          value: ['AAA', 'BBB', 'CC,C'],
          type: 'text'
        },
        {
          attribute: 'attributeId2',
          operator: 'EQUALS',
          value: 'value2',
          type: 'text'
        },
        {
          attribute: 'attributeId3',
          operator: 'EQUALS',
          value: 'val,ue,3',
          type: 'text'
        },
        {
          attribute: 'attributeId4',
          operator: 'EQUALS',
          value: 4,
          type: 'number'
        },
        {
          attribute: 'attributeId5',
          operator: 'EQUALS',
          value: [5, 51, 52.5],
          type: 'number'
        },
        {
          attribute: 'attributeId6',
          operator: 'INSIDE',
          value: '2024-01-01,2024-12-31',
          type: 'date'
        },
        {
          attribute: 'attributeId7',
          operator: 'OUTSIDE',
          value: '2024-01-01,2024-12-31',
          type: 'date'
        }
      ]
    };
    let params = service.getItemsFilter('datasourceid', undefined);

    expect(params.toString()).toBe(
      'filter=attributeId,CONTAINS,AAA,BBB,CC%5C%2CC' +
        '&filter=attributeId2,EQUALS,value2' +
        '&filter=attributeId3,EQUALS,val%5C%2Cue%5C%2C3' +
        '&filter=attributeId4,EQUALS,4' +
        '&filter=attributeId5,EQUALS,5,51,52.5' +
        '&filter=attributeId6,INSIDE,2024-01-01T00%3A00%3A00.000Z,2024-12-31T00%3A00%3A00.000Z' +
        '&filter=attributeId7,OUTSIDE,2024-01-01T00%3A00%3A00.000Z,2024-12-31T00%3A00%3A00.000Z'
    );
  });

  it('getItemsFilter should encode params values depending on operator and append params to previous', () => {
    service.filters = {
      datasourceid: [
        {
          attribute: 'attributeId',
          operator: 'CONTAINS',
          value: ['AAA', 'BBB', 'CC,C'],
          type: 'text'
        },
        {
          attribute: 'attributeId2',
          operator: 'EQUALS',
          value: 'value2',
          type: 'text'
        },
        {
          attribute: 'attributeId3',
          operator: 'EQUALS',
          value: 'val,ue,3',
          type: 'text'
        },
        {
          attribute: 'attributeId4',
          operator: 'EQUALS',
          value: 4,
          type: 'number'
        },
        {
          attribute: 'attributeId5',
          operator: 'EQUALS',
          value: [5, 51, 52.5],
          type: 'number'
        }
      ]
    };
    let previousHttpParams = new HttpParams({ encoder: new FilterParamEncoder() });
    previousHttpParams = previousHttpParams.set('previousParam', 'previousValue');
    previousHttpParams = service.getItemsFilter('datasourceid', previousHttpParams);

    expect(previousHttpParams.toString()).toBe(
      'previousParam=previousValue' +
        '&filter=attributeId,CONTAINS,AAA,BBB,CC%5C%2CC' +
        '&filter=attributeId2,EQUALS,value2' +
        '&filter=attributeId3,EQUALS,val%5C%2Cue%5C%2C3' +
        '&filter=attributeId4,EQUALS,4' +
        '&filter=attributeId5,EQUALS,5,51,52.5'
    );
  });
});
