import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseMenuComponent } from './base-menu.component';
import { provideMockStore } from '@ngrx/store/testing';

describe('BaseMenuComponent', () => {
  let component: BaseMenuComponent;
  let fixture: ComponentFixture<BaseMenuComponent>;
  let spy = spyConsole();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BaseMenuComponent],
      providers: [provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call console error', () => {
    expect(console.error).toHaveBeenCalled();
  });
});

function spyConsole() {
  let spy: { console?: any } = {};
  beforeAll(() => {
    spy.console = jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    spy.console.mockRestore();
  });
  return spy;
}
