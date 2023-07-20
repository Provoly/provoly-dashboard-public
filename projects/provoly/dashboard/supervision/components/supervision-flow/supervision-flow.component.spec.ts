import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockSortPipe } from '../../../mock/pipe/mock-sort.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { SupervisionFlowComponent } from './supervision-flow.component';

describe('SupervisionFlowComponent', () => {
  let component: SupervisionFlowComponent;
  let fixture: ComponentFixture<SupervisionFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupervisionFlowComponent, MockSortPipe, MockTranslatePipe, MockI18nPipe],
      providers: [provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisionFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
