export const enTranslations = {
  '@pry': {
    widget: {
      chart: {
        title: 'Chart title',
        tooltip: 'Display tooltip',
        params: {
          noParams: 'No data for chart with selected settings',
          multipleParams: 'Number of data with selected parameters: '
        },
        encoding: {
          horizontal: 'Horizontal axis',
          vertical: 'Vertical axis',
          group: 'Operation type',
          values: 'Values'
        },
        markType: {
          null: '',
          bar: 'Bar chart',
          line: 'Line',
          point: 'Points',
          area: 'Area',
          arc: 'Arc',
          radar: 'Radar',
          circle_pack: 'Circle packing',
          histogram: 'Histogram',
          timehistogram: 'Time histogram',
          grouped: 'Grouped bar chart',
          histostacked: 'Stacked bar chart',
          withPoints: 'Line with points',
          multi: 'Multi series line chart',
          scatterColor: 'Scatter plot with color',
          withLinesAndPoints: 'Area chart with overlaying lines and point markers',
          areastacked: 'Stacked area chart',
          pie: 'Pie Chart',
          donut: 'Donut chart'
        },
        scheme: {
          accent: '8 colors n°1',
          set2: '8 colors n°2',
          dark2: '8 dark colors',
          pastel2: '8 pastel colors',
          set1: '9 colors',
          pastel1: '9 pastel colors',
          category10: '10 colors',
          tableau10: '10 different colors',
          set3: '12 colors',
          paired: '12 different colors',
          tableau20: '20 colors',
          category20: '20 colors with 2 shades',
          category20b: '20 colors with 4 shades n°1',
          category20c: '20 colors with 4 shades n°2',
          'KO/W/OK': 'Traffic light',
          Provoly: 'Provoly'
        },
        dataLabel: 'Data label',
        origin: 'Origin at zero',
        series: 'Group as series',
        seriesAttr: 'grouping attribute',
        seriesScheme: 'Color scheme',
        seriesSchemeAlt: 'https://vega.github.io/vega/docs/schemes/',
        seriesLegend: 'Display legend',
        chooseParameters: 'Please select parameters to display chart.',
        timeUnit: 'Time unit',
        timeUnitList: {
          year: 'Year',
          quarter: 'Quarter',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          hours: 'Hours',
          minutes: 'Minutes'
        },
        type: 'Chart type',
        template: 'Chart template',
        aggregation: {
          none: 'Value',
          count: 'Count',
          sum: 'Sum',
          distinct: 'Distinct elements',
          average: 'Average',
          median: 'Median',
          q1: 'Lower quartile',
          q3: 'Upper Quartile',
          min: 'Minimum',
          max: 'Maximum'
        },
        comparison: {
          item: 'Compare objects',
          value: 'Value list',
          key: 'Branch property',
          values: 'Value property',
          category: 'Object property'
        },
        radar: {
          titleItem: 'Compare displaying {{props}}',
          titleList: 'Branches {{key}}, diplaying {{value}}, grouped by {{category}}',
          defineKey: '«Key»',
          defineValue: '«Value»',
          defineCategory: '«Category»'
        },
        circle: {
          id: 'Field for item identifier',
          pid: 'Field for parent item identifier',
          field: 'Field containing value',
          title: 'Circle packing displaying {{field}}',
          tooltip: 'Property to display in tooltip'
        },
        innerRadius: 'Inner radius',
        moreOptions: 'Advanced mode'
      }
    }
  }
};
