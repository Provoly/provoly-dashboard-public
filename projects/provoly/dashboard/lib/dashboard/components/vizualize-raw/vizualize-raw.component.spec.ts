import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Item } from '../../../core/model/item.interface';

import { VizualizeRawComponent } from './vizualize-raw.component';

describe('MetadataComponent', () => {
  let component: VizualizeRawComponent;
  let fixture: ComponentFixture<VizualizeRawComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [VizualizeRawComponent],
      providers: [provideMockStore()]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VizualizeRawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("should correctly parse item's empty metadata", () => {
    component.item = {
      id: '1',
      oClass: 'aaa',
      attributes: {
        test1: { value: 4, type: 'VALUE', visible: true },
        test2: { value: 5, type: 'VALUE', visible: true },
        test3: { value: 6, type: 'VALUE', visible: true }
      }
    } as Item;
    //expect(component.metadata).toEqual([]);
  });

  it("should correctly parse item's metadata", () => {
    component.item = {
      id: '1',
      oClass: 'aaa',
      attributes: {
        test1: { value: 4, type: 'VALUE', visible: true },
        test2: { value: 5, type: 'VALUE', visible: true },
        test3: { value: 6, type: 'VALUE', visible: true }
      },
      metadata: { a: 1, other: 1.3, another: 'my value' }
    } as Item;
    /*    expect(component.metadata).toEqual([
      { name: 'a', value: 1 },
      { name: 'other', value: 1.3 },
      { name: 'another', value: 'my value' }
    ]);*/
  });
});
