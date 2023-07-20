export const vegaBaseConf = {
  $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
  title: '',
  width: 'container',
  height: 'container',
  padding: 0,
  autosize: { type: 'fit', contains: 'padding' },
  data: { values: {} },
  layer: [
    {
      mark: {
        type: '',
        point: '',
        innerRadius: 30
      },
      encoding: {}
    }
  ]
} as any;

export const vegaRadarConf = {
  $schema: 'https://vega.github.io/schema/vega/v5.json',
  title: '',
  width: 'container',
  height: 'container',
  padding: 40,
  autosize: { type: 'none', contains: 'padding' },
  signals: [{ name: 'radius', update: 'height / 2' }],
  data: [
    {
      name: 'table',
      values: []
    },
    {
      name: 'keys',
      source: 'table',
      transform: [
        {
          type: 'aggregate',
          groupby: ['key']
        }
      ]
    }
  ],
  scales: [
    {
      name: 'angular',
      type: 'point',
      range: { signal: '[-PI, PI]' },
      padding: 0.5,
      domain: { data: 'table', field: 'key' }
    },
    {
      name: 'radial',
      type: 'linear',
      range: { signal: '[0, radius]' },
      zero: true,
      nice: false,
      domain: { data: 'table', field: 'value' },
      domainMin: 0
    },
    {
      name: 'color',
      type: 'ordinal',
      domain: { data: 'table', field: 'category' },
      range: { scheme: 'category10' }
    }
  ],

  encode: {
    enter: {
      x: { signal: 'radius' },
      y: { signal: 'radius' }
    }
  },

  marks: [
    {
      type: 'group',
      name: 'categories',
      zindex: 1,
      from: {
        facet: { data: 'table', name: 'facet', groupby: ['category'] }
      },
      marks: [
        {
          type: 'line',
          name: 'category-line',
          from: { data: 'facet' },
          encode: {
            enter: {
              interpolate: { value: 'linear-closed' },
              x: { signal: "scale('radial', datum.value) * cos(scale('angular', datum.key))" },
              y: { signal: "scale('radial', datum.value) * sin(scale('angular', datum.key))" },
              stroke: { scale: 'color', field: 'category' },
              strokeWidth: { value: 1 },
              fill: { scale: 'color', field: 'category' },
              fillOpacity: { value: 0.1 }
            }
          }
        },
        {
          type: 'text',
          name: 'value-text',
          from: { data: 'category-line' },
          encode: {
            enter: {
              x: { signal: 'datum.x' },
              y: { signal: 'datum.y' },
              text: { signal: 'datum.datum.value' },
              align: { value: 'center' },
              baseline: { value: 'middle' },
              fill: { value: 'black' }
            }
          }
        }
      ]
    },
    {
      type: 'rule',
      name: 'radial-grid',
      from: { data: 'keys' },
      zindex: 0,
      encode: {
        enter: {
          x: { value: 0 },
          y: { value: 0 },
          x2: { signal: "radius * cos(scale('angular', datum.key))" },
          y2: { signal: "radius * sin(scale('angular', datum.key))" },
          stroke: { value: 'lightgray' },
          strokeWidth: { value: 1 }
        }
      }
    },
    {
      type: 'text',
      name: 'key-label',
      from: { data: 'keys' },
      zindex: 1,
      encode: {
        enter: {
          x: { signal: "(radius + 5) * cos(scale('angular', datum.key))" },
          y: { signal: "(radius + 5) * sin(scale('angular', datum.key))" },
          text: { field: 'key' },
          align: [
            {
              test: "abs(scale('angular', datum.key)) > PI / 2",
              value: 'right'
            },
            {
              value: 'left'
            }
          ],
          baseline: [
            {
              test: "scale('angular', datum.key) > 0",
              value: 'top'
            },
            {
              test: "scale('angular', datum.key) == 0",
              value: 'middle'
            },
            {
              value: 'bottom'
            }
          ],
          fill: { value: 'black' },
          fontWeight: { value: 'bold' }
        }
      }
    },
    {
      type: 'line',
      name: 'outer-line',
      from: { data: 'radial-grid' },
      encode: {
        enter: {
          interpolate: { value: 'linear-closed' },
          x: { field: 'x2' },
          y: { field: 'y2' },
          stroke: { value: 'lightgray' },
          strokeWidth: { value: 1 }
        }
      }
    }
  ]
} as any;

export const vegaCirclePackConf = {
  $schema: 'https://vega.github.io/schema/vega/v5.json',
  description: 'An example of a circle packing layout for hierarchical data.',
  width: 'container',
  height: 'container',
  padding: 0,
  autosize: { type: 'fit', contains: 'padding' },

  data: [
    {
      name: 'table',
      values: []
    },
    {
      name: 'tree',
      source: 'table',
      transform: [
        {
          type: 'stratify',
          key: 'id',
          parentKey: 'parent'
        },
        {
          type: 'pack',
          field: 'size',
          sort: { field: 'value' },
          size: [{ signal: 'width' }, { signal: 'height' }]
        }
      ]
    }
  ],

  scales: [
    {
      name: 'color',
      type: 'ordinal',
      domain: { data: 'tree', field: 'depth' },
      range: { scheme: 'category20' }
    }
  ],

  marks: [
    {
      type: 'symbol',
      from: { data: 'tree' },
      encode: {
        enter: {
          shape: { value: 'circle' },
          fill: { scale: 'color', field: 'depth' },
          tooltip: { signal: "datum.name + (datum.size ? ', ' + datum.size + ' bytes' : '')" }
        },
        update: {
          x: { field: 'x' },
          y: { field: 'y' },
          size: { signal: '4 * datum.r * datum.r' },
          stroke: { value: 'white' },
          strokeWidth: { value: 0.5 }
        },
        hover: {
          stroke: { value: 'red' },
          strokeWidth: { value: 2 }
        }
      }
    }
  ]
};
