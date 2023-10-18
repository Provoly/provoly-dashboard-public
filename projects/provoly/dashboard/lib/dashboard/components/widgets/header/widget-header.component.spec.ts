import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ToolboxMenuService, WidgetManifest } from '@provoly/dashboard';
import { of } from 'rxjs';
import { MockPryIconComponent } from '../../../../../mock/components/mock-pry-icon.component';
import { MockPryAccessDirective } from '../../../../../mock/directive/mock-pry-access.directive';
import { MockI18nPipe } from '../../../../../mock/pipe/mock-i18n.pipe';

import { PryWidgetHeaderComponent } from './widget-header.component';

describe('PryWidgetHeaderComponent', () => {
  let component: PryWidgetHeaderComponent;
  let fixture: ComponentFixture<PryWidgetHeaderComponent>;

  let mockOverlayRef = {
    backdropClick: () => of({}),
    attach: () => undefined,
    dispose: () => undefined
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PryWidgetHeaderComponent, MockPryIconComponent, MockPryAccessDirective, MockI18nPipe],
      providers: [
        provideMockStore({}),
        { provide: Overlay, useValue: mockOverlayRef },
        { provide: ToolboxMenuService, useValue: {} }
      ],
      imports: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryWidgetHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.manifest = { title: '' } as unknown as WidgetManifest;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
