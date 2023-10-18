import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PryToggleComponent } from './toggle.component';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';

describe('ToggleComponent', () => {
  let component: PryToggleComponent;
  let fixture: ComponentFixture<PryToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PryToggleComponent, MockI18nPipe]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should emit change value', () => {
    const spy = jest.spyOn(component, 'onChange');
    const input = fixture.debugElement.query(By.css('.a-toggle__input'));
    input.nativeElement.click();
    expect(spy.mock.calls).toEqual([[true]]);
  });
});
