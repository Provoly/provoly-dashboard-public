import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';

import { SwitchToEditContentComponent } from './switch-to-edit-content.component';

describe('ClearViewComponent', () => {
  let component: SwitchToEditContentComponent;
  let fixture: ComponentFixture<SwitchToEditContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SwitchToEditContentComponent, MockTranslatePipe, MockPryIconComponent, MockI18nPipe],
      providers: [provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchToEditContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
