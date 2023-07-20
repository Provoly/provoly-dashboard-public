import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore } from '@ngrx/store/testing';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { SupervisionTitleComponent } from './supervision-title.component';

describe('SupervisionTitleComponent', () => {
  let component: SupervisionTitleComponent;
  let fixture: ComponentFixture<SupervisionTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SupervisionTitleComponent, MockTranslatePipe, MockPryIconComponent, MockI18nPipe],
      providers: [provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisionTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should toggle Menu', () => {
    const spy = jest.spyOn(component, 'onToggleMenu');
    const icon = fixture.debugElement.query(By.css('.a-btn--toggle'));
    icon.nativeElement.click();
    expect(spy).toHaveBeenCalled();
  });
});
