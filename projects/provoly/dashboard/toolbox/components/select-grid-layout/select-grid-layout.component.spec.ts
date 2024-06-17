import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { MockPryToolboxCssComponent } from '@provoly/dashboard/mock/style/mock-pry-toolbox-css';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockPrySelectComponent } from '../../../mock/components/mock-pry-select.component';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { MockPrySelectGridLayoutCssComponent } from '../../../mock/style/mock-pry-select-grid-layout-css';

import { SelectGridLayoutComponent } from './select-grid-layout.component';
import { PRY_ACCESS_TOKEN, PryDefaultAccessService } from '@provoly/dashboard';
import { MockOverlay } from '@provoly/dashboard/mock/service/mock-overlay.service';

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
        MockPryIconComponent,
        MockPryToolboxCssComponent
      ],
      providers: [
        provideMockStore({}),
        { provide: Overlay, useValue: MockOverlay },
        { provide: PRY_ACCESS_TOKEN, useClass: PryDefaultAccessService }
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
