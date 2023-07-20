import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { BaseLayoutComponent } from './base-layout.component';

describe('AdminComponent', () => {
  let component: BaseLayoutComponent;
  let fixture: ComponentFixture<BaseLayoutComponent>;
  let spy = spyConsole();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [BaseLayoutComponent],
      providers: [provideMockStore({}), { provide: Overlay, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseLayoutComponent);
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
