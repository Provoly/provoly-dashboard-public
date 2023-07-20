import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockPryTooltipDirective } from '../../../mock/directive/mock-pry-tooltip.directive';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';

import { ClearViewComponent } from './clear-view.component';

describe('ClearViewComponent', () => {
  let component: ClearViewComponent;
  let fixture: ComponentFixture<ClearViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ClearViewComponent,
        MockTranslatePipe,
        MockPryIconComponent,
        MockPryTooltipDirective,
        MockI18nPipe
      ],
      providers: [provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
