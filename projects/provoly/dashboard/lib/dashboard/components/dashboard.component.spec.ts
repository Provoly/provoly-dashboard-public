import { Overlay } from '@angular/cdk/overlay';
import { ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockPryContextMenuComponent } from '../../../mock/components/mock-pry-context-menu.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';
import { DashboardActions } from '../store/dashboard.actions';
import { DashboardSelectors } from '../store/dashboard.selectors';

import { DashboardComponent } from './dashboard.component';
import { MockPryIconComponent } from '@provoly/dashboard/mock/components/mock-pry-icon.component';
import { MockOverlay } from '@provoly/dashboard/mock/service/mock-overlay.service';

const exampleManifest = {
  widgets: [
    { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
    {
      type: 'b',
      layout: { x: 2, y: 1, width: 10, height: 8 }
    }
  ]
};

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        MockPryContextMenuComponent,
        MockTranslatePipe,
        MockI18nPipe,
        MockPryIconComponent
      ],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: DashboardSelectors.dashboardCellParams,
              value: {
                gridWidth: 1517,
                gridHeight: 518,
                gridGap: 2,
                columns: 12,
                cellHeight: 50,
                rows: 10,
                cellWidth: 124.58333333333333,
                offsetLeft: 0,
                offsetTop: 63,
                mobileMode: false
              }
            },
            {
              selector: DashboardSelectors.widgetManifest(0),
              value: { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } }
            },
            {
              selector: DashboardSelectors.widgetManifest(1),
              value: { type: 'b', layout: { x: 2, y: 1, width: 10, height: 1 } }
            },
            {
              selector: DashboardSelectors.widgetManifest(2),
              value: { type: 'c', layout: { x: 1, y: 2, width: 3, height: 12 } }
            }
          ]
        }),
        { provide: Overlay, useValue: MockOverlay },
        {
          provide: ViewContainerRef,
          useValue: {}
        }
      ]
    }).compileComponents();

    store = TestBed.inject(MockStore);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    component.params.rows = 10;
    component.params.columns = 12;
    fixture.detectChanges();
  });

  it('should correctly calculate grid column', () => {
    expect(component.gridColumn({ x: 1, y: 1, height: 1, width: 1 })).toBe('1');
    expect(component.gridColumn({ x: 1, y: 3, height: 2, width: 3 })).toBe('1 / 4');
    // max reached
    expect(component.gridColumn({ x: 3, y: 5, height: 4, width: 6 })).toBe('3 / 9');
  });

  it('should correctly calculate grid row', () => {
    expect(component.gridRow({ x: 1, y: 1, height: 1, width: 1 })).toBe('1');
    expect(component.gridRow({ x: 1, y: 3, height: 2, width: 3 })).toBe('3 / 5');
    // max reached
    expect(component.gridRow({ x: 3, y: 5, height: 4, width: 6 })).toBe('5 / 9');
  });

  it('should correctly calculate grid row', () => {
    component.dashboardParams.mobileMode = false;
    expect(component.generateColumns(12)).toBe('1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr');
  });

  it('should move element corresponding to mouse move', () => {
    const spyDispatch = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);

    component.manifest = {
      widgets: [
        { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
        {
          type: 'b',
          layout: { x: 2, y: 1, width: 10, height: 1 }
        },
        { type: 'c', layout: { x: 1, y: 2, width: 3, height: 12 } }
      ]
    };
    component.currentlyModifiedManifest = component.manifest.widgets[2];
    component.initialWidgetManifestList = [...component.manifest.widgets].filter((_, i) => i !== 2);
    component.modeEdition = true;
    component.actionType = 'move';
    component.dashboardParams = {
      gridWidth: 1517,
      gridHeight: 518,
      gridGap: 2,
      columns: 12,
      cellHeight: 50,
      rows: 10,
      cellWidth: 124.58333333333333,
      offsetLeft: 0,
      offsetTop: 63,
      mobileMode: true
    };
    component.movingMouse({ pageX: 456, pageY: 328 } as DragEvent);
    fixture.detectChanges();

    expect(spyDispatch).toHaveBeenCalledWith(
      DashboardActions.updateDashboardManifest({
        manifest: {
          grid: { rows: 12 },
          widgets: [
            { type: 'c', layout: { x: 4, y: 3, width: 3, height: 12 } },
            { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
            {
              type: 'b',
              layout: { x: 2, y: 1, width: 10, height: 1 }
            }
          ]
        }
      })
    );
  });

  it('should resize (NW) element corresponding to mouse move', () => {
    const spyDispatch = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);

    component.manifest = exampleManifest;
    component.currentlyModifiedManifest = exampleManifest.widgets[0];
    component.initialWidgetManifestList = [...exampleManifest.widgets].filter((_, i) => i !== 0);
    component.modeEdition = true;
    component.actionType = 'resize-nw';
    component.dashboardParams = {
      gridWidth: 1517,
      gridHeight: 518,
      gridGap: 2,
      columns: 12,
      cellHeight: 50,
      rows: 10,
      cellWidth: 124.58333333333333,
      offsetLeft: 0,
      offsetTop: 63,
      mobileMode: true
    };
    component.movingMouse({ pageX: 100, pageY: 200 } as DragEvent);
    fixture.detectChanges();

    expect(spyDispatch).toHaveBeenCalledWith(
      DashboardActions.updateDashboardManifest({
        manifest: {
          grid: { rows: 12 },
          widgets: [
            { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
            {
              type: 'b',
              layout: { x: 2, y: 1, width: 10, height: 8 }
            }
          ]
        }
      })
    );
  });

  it('should resize (NE) element corresponding to mouse move', () => {
    const spyDispatch = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);

    component.manifest = exampleManifest;
    component.currentlyModifiedManifest = exampleManifest.widgets[0];
    component.initialWidgetManifestList = [...exampleManifest.widgets].filter((_, i) => i !== 0);
    component.modeEdition = true;
    component.actionType = 'resize-ne';
    component.dashboardParams = {
      gridWidth: 1517,
      gridHeight: 518,
      gridGap: 2,
      columns: 12,
      cellHeight: 50,
      rows: 10,
      cellWidth: 124.58333333333333,
      offsetLeft: 0,
      offsetTop: 63,
      mobileMode: false
    };
    component.movingMouse({ pageX: 100, pageY: 200 } as DragEvent);
    fixture.detectChanges();

    expect(spyDispatch).toHaveBeenCalledWith(
      DashboardActions.updateDashboardManifest({
        manifest: {
          grid: { rows: 12 },
          widgets: [
            { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
            {
              type: 'b',
              layout: { x: 2, y: 1, width: 10, height: 8 }
            }
          ]
        }
      })
    );
  });

  it('should resize (NE) element corresponding to mouse move', () => {
    const spyDispatch = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);

    component.manifest = exampleManifest;
    component.currentlyModifiedManifest = exampleManifest.widgets[0];
    component.initialWidgetManifestList = [...exampleManifest.widgets].filter((_, i) => i !== 0);
    component.modeEdition = true;
    component.actionType = 'resize-ne';
    component.dashboardParams = {
      gridWidth: 1517,
      gridHeight: 518,
      gridGap: 2,
      columns: 12,
      cellHeight: 50,
      rows: 10,
      cellWidth: 124.58333333333333,
      offsetLeft: 0,
      offsetTop: 63,
      mobileMode: false
    };
    component.movingMouse({ pageX: 500, pageY: 300 } as DragEvent);
    fixture.detectChanges();

    expect(spyDispatch).toHaveBeenCalledWith(
      DashboardActions.updateDashboardManifest({
        manifest: {
          grid: { rows: 12 },
          widgets: [
            { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
            {
              type: 'b',
              layout: { x: 2, y: 1, width: 10, height: 8 }
            }
          ]
        }
      })
    );
  });

  it('should resize (SW) element corresponding to mouse move', () => {
    const spyDispatch = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);

    component.manifest = exampleManifest;
    component.currentlyModifiedManifest = exampleManifest.widgets[0];
    component.initialWidgetManifestList = [...exampleManifest.widgets].filter((_, i) => i !== 0);
    component.modeEdition = true;
    component.actionType = 'resize-sw';
    component.dashboardParams = {
      gridWidth: 1517,
      gridHeight: 518,
      gridGap: 2,
      columns: 12,

      cellHeight: 50,
      rows: 10,
      cellWidth: 124.58333333333333,
      offsetLeft: 0,
      offsetTop: 63,
      mobileMode: true
    };
    component.movingMouse({ pageX: 0, pageY: 300 } as DragEvent);
    fixture.detectChanges();

    expect(spyDispatch).toHaveBeenCalledWith(
      DashboardActions.updateDashboardManifest({
        manifest: {
          grid: { rows: 12 },
          widgets: [
            { type: 'a', layout: { x: 1, y: 1, width: 1, height: 6 } },
            {
              type: 'b',
              layout: { x: 2, y: 1, width: 10, height: 8 }
            }
          ]
        }
      })
    );
  });

  it('should resize (SE) element corresponding to mouse move (but blocked by widgets)', () => {
    const spyDispatch = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);

    component.manifest = exampleManifest;
    component.currentlyModifiedManifest = exampleManifest.widgets[0];
    component.initialWidgetManifestList = [...exampleManifest.widgets].filter((_, i) => i !== 0);
    component.modeEdition = true;
    component.actionType = 'resize-se';
    component.dashboardParams = {
      gridWidth: 1517,
      gridHeight: 518,
      gridGap: 2,
      columns: 12,
      cellHeight: 50,
      rows: 10,
      cellWidth: 124.58333333333333,
      offsetLeft: 0,
      offsetTop: 63,
      mobileMode: true
    };
    component.movingMouse({ pageX: 180, pageY: 300 } as DragEvent);
    fixture.detectChanges();

    expect(spyDispatch).toHaveBeenCalledWith(
      DashboardActions.updateDashboardManifest({
        manifest: {
          widgets: [
            { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
            {
              type: 'b',
              layout: { x: 2, y: 1, width: 10, height: 8 }
            }
          ]
        }
      })
    );
  });

  it('should remove element when dragLeave', () => {
    const spyDispatch = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);

    component.manifest = {
      widgets: [
        { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
        {
          type: 'b',
          layout: { x: 2, y: 1, width: 10, height: 1 }
        },
        { type: 'c', layout: { x: 1, y: 2, width: 3, height: 12 } }
      ]
    };
    component.currentlyModifiedManifest = component.manifest.widgets[0];
    component.initialWidgetManifestList = [...component.manifest.widgets].filter((_, i) => i > 0);
    component.modeEdition = true;
    component.actionType = 'move';
    component.dragLeave({
      pageX: 456,
      pageY: 328,
      stopPropagation: () => {},
      preventDefault: () => {},
      currentTarget: { contains: () => false },
      dataTransfer: {
        types: ['application/widget-manifest'],
        setData: () => {}
      }
    } as unknown as DragEvent);
    fixture.detectChanges();

    expect(spyDispatch).toHaveBeenNthCalledWith(
      1,
      DashboardActions.updateDashboardManifest({
        manifest: {
          widgets: [
            {
              type: 'b',
              layout: { x: 2, y: 1, width: 10, height: 1 }
            },
            { type: 'c', layout: { x: 1, y: 2, width: 3, height: 12 } }
          ]
        }
      })
    );
  });

  it('should toggle edition mode when dragEnter', () => {
    const spyDispatch = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);

    component.manifest = {
      widgets: [
        { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
        {
          type: 'b',
          layout: { x: 2, y: 1, width: 10, height: 1 }
        },
        { type: 'c', layout: { x: 1, y: 2, width: 3, height: 12 } }
      ]
    };
    component.modeEdition = true;
    component.actionType = 'move';
    component.dragEnter({
      pageX: 456,
      pageY: 328,
      stopPropagation: () => {},
      preventDefault: () => {},
      currentTarget: { contains: () => false },
      dataTransfer: {
        types: ['application/widget-manifest'],
        setData: () => {}
      }
    } as unknown as DragEvent);
    fixture.detectChanges();

    expect(spyDispatch).toHaveBeenNthCalledWith(1, DashboardActions.toggleEditionMode({ force: true }));
  });

  it('should change resultset when dropping it in widget', () => {
    const spyDispatch = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);

    component.manifest = {
      widgets: [
        { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
        {
          type: 'b',
          layout: { x: 2, y: 1, width: 10, height: 1 }
        },
        { type: 'c', layout: { x: 1, y: 2, width: 3, height: 12 } }
      ]
    };
    component.modeEdition = true;
    component.actionType = 'move';
    component.droppingInWidget(
      {
        pageX: 456,
        pageY: 328,
        stopPropagation: () => {},
        preventDefault: () => {},
        currentTarget: { contains: () => false },
        dataTransfer: {
          types: ['application/resultset'],
          setData: () => {},
          getData: () => 'rs'
        }
      } as unknown as DragEvent,
      1
    );
    fixture.detectChanges();

    expect(spyDispatch).toHaveBeenNthCalledWith(2, DashboardActions.assertResultSets({}));
    expect(spyDispatch).toHaveBeenNthCalledWith(
      1,
      DashboardActions.updateDashboardManifest({
        manifest: {
          widgets: [
            { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
            {
              type: 'b',
              layout: { x: 2, y: 1, width: 10, height: 1 },
              datasource: 'rs'
            },
            { type: 'c', layout: { x: 1, y: 2, width: 3, height: 12 } }
          ]
        }
      })
    );
  });

  it('should add widget when dropping it in dashboard', () => {
    const spyDispatch = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);

    component.manifest = {
      widgets: [
        { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
        {
          type: 'b',
          layout: { x: 2, y: 1, width: 10, height: 1 }
        },
        { type: 'placeholder', layout: { x: 1, y: 2, width: 3, height: 12 } }
      ]
    };
    component.currentlyModifiedManifest = component.manifest.widgets[2];
    component.initialWidgetManifestList = [...component.manifest.widgets].filter((_, i) => i !== 2);
    component.modeEdition = true;
    component.actionType = 'move';
    component.dropping({
      pageX: 728,
      pageY: 293,
      stopPropagation: () => {},
      preventDefault: () => {},
      currentTarget: { contains: () => false },
      dataTransfer: {
        types: ['application/widget-manifest'],
        setData: () => {},
        getData: () => '{ "type": "new", "layout": { "x": 0, "y": 0, "width": 3, "height": 5 } }'
      }
    } as unknown as DragEvent);
    fixture.detectChanges();

    expect(spyDispatch).toHaveBeenCalledWith(DashboardActions.assertResultSets({}));
    expect(spyDispatch).toHaveBeenCalledWith(
      DashboardActions.updateDashboardManifest({
        manifest: {
          grid: { rows: 12 },
          widgets: [
            { type: 'new', layout: { x: 6, y: 3, width: 3, height: 12 } },
            { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
            {
              type: 'b',
              layout: { x: 2, y: 1, width: 10, height: 1 }
            }
          ]
        }
      })
    );
  });

  it('should remove a widget when asked', () => {
    const spyDispatch = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);

    component.manifest = {
      widgets: [
        { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
        {
          type: 'b',
          layout: { x: 2, y: 1, width: 10, height: 1 }
        },
        { type: 'placeholder', layout: { x: 1, y: 2, width: 3, height: 12 } }
      ]
    };
    component.remove(1);
    fixture.detectChanges();

    expect(spyDispatch).toHaveBeenCalledWith(
      DashboardActions.updateDashboardManifest({
        manifest: {
          widgets: [
            { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
            { type: 'placeholder', layout: { x: 1, y: 2, width: 3, height: 12 } }
          ]
        }
      })
    );
  });

  it('should move a widget when asked', () => {
    const spyDispatch = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);

    component.manifest = {
      widgets: [
        { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
        {
          type: 'b',
          layout: { x: 2, y: 1, width: 10, height: 1 }
        },
        { type: 'placeholder', layout: { x: 1, y: 2, width: 3, height: 12 } }
      ]
    };
    component.moveInNewWindow(1, 2);
    fixture.detectChanges();

    expect(spyDispatch).toHaveBeenNthCalledWith(1, DashboardActions.moveWidget({ widgetIndex: 1, targetIndex: 2 }));
    expect(spyDispatch).toHaveBeenNthCalledWith(2, DashboardActions.toggleEditionMode({ force: false }));
  });

  it('should call move on a dragMove', () => {
    const spyDispatch = jest.spyOn(component, 'movingMouse').mockReturnValue(undefined);

    component.manifest = {
      widgets: [
        { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
        {
          type: 'b',
          layout: { x: 2, y: 1, width: 10, height: 1 }
        },
        { type: 'placeholder', layout: { x: 1, y: 2, width: 3, height: 12 } }
      ]
    };
    const event = {
      pageX: 728,
      pageY: 293,
      stopPropagation: () => {},
      preventDefault: () => {},
      currentTarget: { contains: () => false },
      dataTransfer: {
        types: ['application/widget-manifest'],
        setData: () => {},
        getData: () => '{ "type": "new", "layout": { "x": 0, "y": 0, "width": 3, "height": 5 } }'
      }
    } as unknown as DragEvent;
    component.dragMove(event);
    fixture.detectChanges();

    expect(spyDispatch).toHaveBeenNthCalledWith(1, event);
  });

  it('should maximize a widget when asked', () => {
    const spyDispatch = jest.spyOn(store, 'dispatch').mockReturnValue(undefined);

    component.manifest = {
      widgets: [
        { type: 'a', layout: { x: 1, y: 1, width: 1, height: 1 } },
        {
          type: 'b',
          layout: { x: 2, y: 1, width: 10, height: 1 }
        },
        { type: 'placeholder', layout: { x: 1, y: 2, width: 3, height: 12 } }
      ]
    };
    component.maximize(1);
    fixture.detectChanges();

    expect(spyDispatch).toHaveBeenCalledWith(DashboardActions.maximizeWidget({ widgetIndex: 1 }));
  });
});
