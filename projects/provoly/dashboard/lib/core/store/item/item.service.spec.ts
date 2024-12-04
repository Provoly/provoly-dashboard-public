import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ConfigSelectors, Item, ItemUtils, ResultSet } from '@provoly/dashboard';
import { ItemService } from './item.service';

const item: Item = {
  id: 'test-id',
  oClass: 'test-class',
  attributes: {
    attr: { type: 'VALUE', value: 'test', visible: true }
  }
};
describe('Item Service', () => {
  let service: ItemService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ItemUtils,
        provideMockStore({
          selectors: [
            {
              selector: ConfigSelectors.dataUrl,
              value: 'data'
            }
          ]
        })
      ]
    });
    service = TestBed.inject(ItemService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should get an item by its id', () => {
    let response!: Item;
    service.get('test-id').subscribe((item) => (response = item));

    const req = httpTestingController.expectOne('data/items/id/test-id');
    req.flush(item);

    expect(item.id).toBe('test-id');
  });

  it('should return items connected by a relation to the node of this id', () => {
    let resultSet!: ResultSet;
    service.proximity('test-id').subscribe((rs) => (resultSet = rs));

    const req = httpTestingController.expectOne('data/items/id/test-id/relations');
    req.flush({
      items: { 'test-class': [item, item] },
      relations: [{ source: 'test', destination: 'dest', relationType: 'type' }]
    } as ResultSet);

    expect(resultSet.items['test-class'].length).toBe(2);
    expect(resultSet.relations.length).toBe(1);
  });

  it('should create an item', () => {
    let response!: Item[];
    service.create(item, 'my-datasource-version-id').subscribe((items) => (response = items));

    const req = httpTestingController.expectOne('data/items?updateMode=MERGE');
    req.flush([item]);

    expect(response[0].oClass).toBe('test-class');
  });
});
