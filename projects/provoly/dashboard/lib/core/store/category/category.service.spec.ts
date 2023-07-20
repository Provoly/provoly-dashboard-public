import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideMockStore({})]
    });
    service = TestBed.inject(CategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
