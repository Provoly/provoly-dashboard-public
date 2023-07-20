import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryAccessDirective } from '../../../mock/directive/mock-pry-access.directive';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { SupervisionSelectors } from '../../store/supervision.selectors';
import { SupervisionMenuComponent } from './supervision-menu.component';

describe('SupervisionMenuComponent', () => {
  let component: SupervisionMenuComponent;
  let fixture: ComponentFixture<SupervisionMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SupervisionMenuComponent, MockTranslatePipe, MockPryAccessDirective, MockI18nPipe],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: SupervisionSelectors.menus,
              value: [
                { menu: 'menu 1', module: 'supervision' },
                { menu: 'menu 2', module: 'supervision' },
                { menu: 'menu 3', module: 'supervision' }
              ]
            }
          ]
        })
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisionMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should select second menu', () => {
    const spy = jest.spyOn(component, 'select');
    const items = fixture.debugElement.queryAll(By.css('.m-nav-links__list__item'));
    expect(items.length).toEqual(3);
    expect(items[1].nativeElement).toBeDefined();
    items[1].nativeElement.click();
    expect(spy.mock.calls).toEqual([]);
  });
});
