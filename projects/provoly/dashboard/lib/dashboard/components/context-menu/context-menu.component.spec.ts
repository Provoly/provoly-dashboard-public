import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { WIDGET_DEFINITION } from '@provoly/dashboard';
import { ContextMenuComponent } from './context-menu.component';
import { MockOverlay } from '@provoly/dashboard/mock/service/mock-overlay.service';

describe('ContextMenuComponent', () => {
  let component: ContextMenuComponent;
  let fixture: ComponentFixture<ContextMenuComponent>;



  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContextMenuComponent],
      providers: [
        provideMockStore({}),
        { provide: Overlay, useValue: MockOverlay },
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
