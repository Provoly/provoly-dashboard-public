import { DashboardGridLayout, WidgetManifest } from '../../../../core/model/manifest.interface';
import { WidgetPlacementUtils } from './widget-placement.utils';

describe('WidgetPlacementUtils', () => {
  describe('isLeft', () => {
    it('should tell if items left from another', () => {
      expect(
        WidgetPlacementUtils.isLeft(
          { layout: { x: 4 } } as WidgetManifest,
          { layout: { x: 1, width: 3 } } as WidgetManifest
        )
      ).toBe(true);
    });
    it('should tell if items are overlapping', () => {
      expect(
        WidgetPlacementUtils.isLeft(
          { layout: { x: 2 } } as WidgetManifest,
          { layout: { x: 1, width: 3 } } as WidgetManifest
        )
      ).toBe(false);
    });
    it('should tell if items are not overlapping but not left', () => {
      expect(
        WidgetPlacementUtils.isLeft(
          { layout: { x: 1, width: 3 } } as WidgetManifest,
          { layout: { x: 2 } } as WidgetManifest
        )
      ).toBe(false);
    });
  });
  describe('isBelow', () => {
    it('should tell if items below from another', () => {
      expect(
        WidgetPlacementUtils.isBelow(
          { layout: { y: 4 } } as WidgetManifest,
          { layout: { y: 1, height: 3 } } as WidgetManifest
        )
      ).toBe(true);
    });
    it('should tell if items are overlapping', () => {
      expect(
        WidgetPlacementUtils.isBelow(
          { layout: { y: 3 } } as WidgetManifest,
          { layout: { y: 1, height: 3 } } as WidgetManifest
        )
      ).toBe(false);
    });
    it('should tell if items are not overlapping but not left', () => {
      expect(
        WidgetPlacementUtils.isBelow(
          { layout: { y: 1, height: 3 } } as WidgetManifest,
          { layout: { y: 2 } } as WidgetManifest
        )
      ).toBe(false);
    });
  });
  describe('areDisjoint', () => {
    it('should tell if items are disjoint', () => {
      expect(
        WidgetPlacementUtils.areDisjoint(
          { layout: { x: 1, y: 1, height: 4, width: 12 } } as WidgetManifest,
          { layout: { x: 1, y: 5, height: 4, width: 12 } } as WidgetManifest
        )
      ).toBe(true);
      expect(
        WidgetPlacementUtils.areDisjoint(
          { layout: { x: 1, y: 1, height: 4, width: 12 } } as WidgetManifest,
          { layout: { x: 1, y: 1, height: 4, width: 12 } } as WidgetManifest
        )
      ).toBe(false);
      expect(
        WidgetPlacementUtils.areDisjoint(
          { layout: { x: 1, y: 1, height: 4, width: 12 } } as WidgetManifest,
          { layout: { x: 1, y: 3, height: 4, width: 12 } } as WidgetManifest
        )
      ).toBe(false);
      expect(
        WidgetPlacementUtils.areDisjoint(
          { layout: { x: 1, y: 1, height: 4, width: 12 } } as WidgetManifest,
          { layout: { x: 10, y: 1, height: 4, width: 12 } } as WidgetManifest
        )
      ).toBe(false);
      expect(
        WidgetPlacementUtils.areDisjoint(
          { layout: { x: 1, y: 1, height: 4, width: 12 } } as WidgetManifest,
          { layout: { x: 1, y: 12, height: 4, width: 12 } } as WidgetManifest
        )
      ).toBe(true);
    });
  });

  describe('placementOptions', () => {
    it('should do not do anything if wrong parameters', () => {
      expect(
        WidgetPlacementUtils.placementOptions({} as WidgetManifest, undefined as unknown as DashboardGridLayout)
      ).toEqual([]);
    });
    it('should propose correct placement with fullscreen size', () => {
      expect(WidgetPlacementUtils.placementOptions({} as WidgetManifest, DashboardGridLayout.FULL)).toEqual([
        { layout: { x: 1, y: 1, width: 12, height: 12 } }
      ]);
    });
    it('should propose correct placement with halfscreen horizontal size', () => {
      expect(WidgetPlacementUtils.placementOptions({} as WidgetManifest, DashboardGridLayout.HALF_HORIZONTAL)).toEqual([
        { layout: { x: 1, y: 1, width: 12, height: 6 } },
        { layout: { x: 1, y: 7, width: 12, height: 6 } }
      ]);
    });
    it('should propose correct placement with halfscreen vertical size', () => {
      expect(WidgetPlacementUtils.placementOptions({} as WidgetManifest, DashboardGridLayout.HALF_VERTICAL)).toEqual([
        { layout: { x: 1, y: 1, width: 6, height: 12 } },
        { layout: { x: 7, y: 1, width: 6, height: 12 } }
      ]);
    });
    it('should propose correct placement with third horizontal size', () => {
      expect(WidgetPlacementUtils.placementOptions({} as WidgetManifest, DashboardGridLayout.THIRD_HORIZONTAL)).toEqual(
        [
          { layout: { x: 1, y: 1, width: 12, height: 4 } },
          { layout: { x: 1, y: 5, width: 12, height: 4 } },
          { layout: { x: 1, y: 9, width: 12, height: 4 } }
        ]
      );
    });
    it('should propose correct placement with third vertical size', () => {
      expect(WidgetPlacementUtils.placementOptions({} as WidgetManifest, DashboardGridLayout.THIRD_VERTICAL)).toEqual([
        { layout: { x: 1, y: 1, width: 4, height: 12 } },
        { layout: { x: 5, y: 1, width: 4, height: 12 } },
        { layout: { x: 9, y: 1, width: 4, height: 12 } }
      ]);
    });
    it('should propose correct placement with quarter size', () => {
      expect(WidgetPlacementUtils.placementOptions({} as WidgetManifest, DashboardGridLayout.QUARTER)).toEqual([
        { layout: { x: 1, y: 1, width: 6, height: 6 } },
        { layout: { x: 1, y: 7, width: 6, height: 6 } },
        { layout: { x: 7, y: 1, width: 6, height: 6 } },
        { layout: { x: 7, y: 7, width: 6, height: 6 } }
      ]);
    });
  });
  describe('initializeLayoutSize', () => {
    it('should prepare for correct sizes for full screen', () => {
      expect(WidgetPlacementUtils.getLayout(DashboardGridLayout.FULL)?.places).toEqual([
        { x: 1, y: 1, width: 12, height: 12 }
      ]);
    });
    it('should prepare for correct sizes for half vertical screen', () => {
      expect(WidgetPlacementUtils.getLayout(DashboardGridLayout.HALF_VERTICAL)?.places).toEqual([
        { x: 1, y: 1, width: 6, height: 12 },
        { x: 7, y: 1, width: 6, height: 12 }
      ]);
    });
    it('should prepare for correct sizes for half horizontal screen', () => {
      expect(WidgetPlacementUtils.getLayout(DashboardGridLayout.HALF_HORIZONTAL)?.places).toEqual([
        { x: 1, y: 1, width: 12, height: 6 },
        { x: 1, y: 7, width: 12, height: 6 }
      ]);
    });
    it('should prepare for correct sizes for third vertical screen', () => {
      expect(WidgetPlacementUtils.getLayout(DashboardGridLayout.THIRD_VERTICAL)?.places).toEqual([
        { x: 1, y: 1, width: 4, height: 12 },
        { x: 5, y: 1, width: 4, height: 12 },
        { x: 9, y: 1, width: 4, height: 12 }
      ]);
    });
    it('should prepare for correct sizes for third horizontal screen', () => {
      expect(WidgetPlacementUtils.getLayout(DashboardGridLayout.THIRD_HORIZONTAL)?.places).toEqual([
        { x: 1, y: 1, width: 12, height: 4 },
        { x: 1, y: 5, width: 12, height: 4 },
        { x: 1, y: 9, width: 12, height: 4 }
      ]);
    });
    it('should prepare for correct sizes for quarter screen', () => {
      expect(WidgetPlacementUtils.getLayout(DashboardGridLayout.QUARTER)?.places).toEqual([
        { x: 1, y: 1, width: 6, height: 6 },
        { x: 1, y: 7, width: 6, height: 6 },
        { x: 7, y: 1, width: 6, height: 6 },
        { x: 7, y: 7, width: 6, height: 6 }
      ]);
    });
  });
  describe('overlappingWidgets', () => {
    it('should tell if items are overlapping', () => {
      expect(
        WidgetPlacementUtils.getOverlaps([
          { layout: { x: 1, y: 1, height: 4, width: 12 } } as WidgetManifest,
          { layout: { x: 1, y: 5, height: 4, width: 12 } } as WidgetManifest
        ])
      ).toStrictEqual([]);
      expect(
        WidgetPlacementUtils.getOverlaps([
          { layout: { x: 1, y: 1, height: 4, width: 12 } } as WidgetManifest,
          { layout: { x: 1, y: 1, height: 4, width: 12 } } as WidgetManifest
        ])
      ).toStrictEqual([
        [
          { layout: { x: 1, y: 1, height: 4, width: 12 } } as WidgetManifest,
          { layout: { x: 1, y: 1, height: 4, width: 12 } } as WidgetManifest
        ]
      ]);
      expect(
        WidgetPlacementUtils.getOverlaps([
          { layout: { x: 1, y: 1, height: 4, width: 12 } } as WidgetManifest,
          { layout: { x: 1, y: 3, height: 4, width: 12 } } as WidgetManifest
        ])
      ).toStrictEqual([
        [
          { layout: { x: 1, y: 1, height: 4, width: 12 } } as WidgetManifest,
          { layout: { x: 1, y: 3, height: 4, width: 12 } } as WidgetManifest
        ]
      ]);
      expect(
        WidgetPlacementUtils.getOverlaps([
          { layout: { x: 1, y: 1, height: 4, width: 12 } } as WidgetManifest,
          { layout: { x: 10, y: 1, height: 4, width: 12 } } as WidgetManifest,
          { layout: { x: 10, y: 1, height: 4, width: 12 } } as WidgetManifest,
          { layout: { x: 10, y: 1, height: 4, width: 12 } } as WidgetManifest
        ])
      ).toStrictEqual([
        [
          { layout: { height: 4, width: 12, x: 1, y: 1 } },
          {
            layout: {
              height: 4,
              width: 12,
              x: 10,
              y: 1
            }
          },
          { layout: { height: 4, width: 12, x: 10, y: 1 } },
          {
            layout: {
              height: 4,
              width: 12,
              x: 10,
              y: 1
            }
          }
        ],
        [
          { layout: { height: 4, width: 12, x: 10, y: 1 } },
          {
            layout: {
              height: 4,
              width: 12,
              x: 10,
              y: 1
            }
          },
          { layout: { height: 4, width: 12, x: 10, y: 1 } }
        ],
        [
          {
            layout: {
              height: 4,
              width: 12,
              x: 10,
              y: 1
            }
          },
          { layout: { height: 4, width: 12, x: 10, y: 1 } }
        ]
      ]);
    });
  });
});
