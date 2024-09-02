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
          value: ['AAA', 'BBB', 'CC,C']
        },
        {
          attribute: 'attributeId2',
          operator: 'EQUALS',
          value: 'value2'
        },
        {
          attribute: 'attributeId3',
          operator: 'EQUALS',
          value: 'val,ue,3'
        },
        {
          attribute: 'attributeId4',
          operator: 'EQUALS',
          value: 4
        },
        {
          attribute: 'attributeId5',
          operator: 'EQUALS',
          value: [5, 51, 52.5]
        }
      ]
    };
    let params = service.getItemsFilter('datasourceid', undefined, false);

    expect(params.toString()).toBe(
      'filter=attributeId,CONTAINS,AAA,BBB,CC%5C%2CC' +
        '&filter=attributeId2,EQUALS,value2' +
        '&filter=attributeId3,EQUALS,val%5C%2Cue%5C%2C3' +
        '&filter=attributeId4,EQUALS,4' +
        '&filter=attributeId5,EQUALS,5,51,52.5'
    );
  });
});
