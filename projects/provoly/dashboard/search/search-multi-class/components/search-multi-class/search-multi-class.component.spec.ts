import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { MockPryMultiClassConditionComponent } from '../../../../mock/components/search/mock-pry-multi-class-condition.component';
import { MockPryOverlayDirective } from '../../../../mock/directive/mock-pry-overlay.directive';
import { MockPryTooltipDirective } from '../../../../mock/directive/mock-pry-tooltip.directive';
import { MockI18nPipe } from '../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../mock/pipe/mock-translate.pipe';
import { PrySearchMultiClassComponent } from './search-multi-class.component';

describe('SearchMultiClassComponent', () => {
  let component: PrySearchMultiClassComponent;
  let fixture: ComponentFixture<PrySearchMultiClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PrySearchMultiClassComponent,
        MockPryIconComponent,
        MockTranslatePipe,
        MockPryMultiClassConditionComponent,
        MockPryOverlayDirective,
        MockPryTooltipDirective,
        MockI18nPipe
      ],
      providers: [provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrySearchMultiClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
