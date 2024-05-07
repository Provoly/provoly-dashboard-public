import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';

import { SwitchToEditContentComponent } from './switch-to-edit-content.component';
import { PRY_ACCESS_TOKEN, PryDefaultAccessService } from '@provoly/dashboard';

describe('ClearViewComponent', () => {
  let component: SwitchToEditContentComponent;
  let fixture: ComponentFixture<SwitchToEditContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SwitchToEditContentComponent, MockTranslatePipe, MockPryIconComponent, MockI18nPipe],
      providers: [provideMockStore({}), { provide: PRY_ACCESS_TOKEN, useClass: PryDefaultAccessService }]
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
