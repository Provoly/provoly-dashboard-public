import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { MetadataSelectors } from '../../../admin-metadata/store/metadata.selector';
import { SelectMetadataComponent } from './select-metadata.component';

describe('SelectMetadataComponent', () => {
  let component: SelectMetadataComponent;
  let fixture: ComponentFixture<SelectMetadataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectMetadataComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: MetadataSelectors.metadata,
              value: [{ id: 'metadata', name: 'name' }]
            }
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call onSelectMetadata', () => {
    const spy = jest.spyOn(component, 'onSelectMetadata');
    const element = fixture.debugElement.query(By.css('.m-pry-overlay-item'));
    element.nativeElement.click();
    expect(spy.mock.calls).toEqual([['metadata']]);
  });
});
