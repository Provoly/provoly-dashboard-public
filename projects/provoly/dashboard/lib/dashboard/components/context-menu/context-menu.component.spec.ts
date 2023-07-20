import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { WIDGET_DEFINITION } from '@provoly/dashboard';
import 'jest';
import { of } from 'rxjs';
import { ContextMenuComponent } from './context-menu.component';

describe('ContextMenuComponent', () => {
  let component: ContextMenuComponent;
  let fixture: ComponentFixture<ContextMenuComponent>;

  let mockOverlayRef = {
    backdropClick: () => of({}),
    attach: () => undefined,
    dispose: () => undefined
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContextMenuComponent],
      providers: [
        provideMockStore({}),
        {
          provide: Overlay,
          useValue: {
            create: () => mockOverlayRef
          }
        },
        { provide: WIDGET_DEFINITION, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
