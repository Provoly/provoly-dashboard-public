import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';

import { SelectGridLayoutComponent } from './select-grid-layout.component';

describe('SelectGridLayoutComponent', () => {
  let component: SelectGridLayoutComponent;
  let fixture: ComponentFixture<SelectGridLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SelectGridLayoutComponent,
        MockTranslatePipe,
        MockPrySelectComponent,
        MockPrySelectComponent,
        MockI18nPipe,
        MockPrySelectGridLayoutCssComponent,
        MockPryIconComponent
      ],
      providers: [
        provideMockStore({}),
        {
          provide: Overlay,
          useValue: {
            create: () => {
              {
              }
            }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectGridLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
