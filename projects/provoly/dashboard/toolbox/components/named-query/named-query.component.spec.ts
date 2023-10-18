import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';

import { NamedQueryComponent } from './named-query.component';

describe('ResultsetComponent', () => {
  let component: NamedQueryComponent;
  let fixture: ComponentFixture<NamedQueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NamedQueryComponent, MockPryIconComponent, MockTranslatePipe, MockI18nPipe],
      providers: [provideMockStore({ initialState: {} })]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NamedQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle', () => {
    component.toggle();
    expect(component.displayCombo).toBeTruthy();
    component.toggle();
    expect(component.displayCombo).toBeFalsy();
  });

  it('should correctly prepare dragging object', () => {
    const event = {
      dataTransfer: {
        setData: () => null,
        types: []
      }
    };

    component.dragStart(event as unknown as DragEvent, 'table');
    expect(component.displayCombo).toBeFalsy();
  });
});
