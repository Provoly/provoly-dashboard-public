export const enTranslations = {
  '@pry': {
    widget: {
      chart: {
        numberLocale: {
          decimal: '.',
          thousands: ',',
          grouping: [3],
          currency: ['$', '']
        },
        timeFormatLocale: {
          dateTime: '%Y %B %d %H:%M:%S',
          date: '%d/%m/%Y',
          time: '%H:%M:%S',
          periods: ['AM', 'PM'],
          days: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          shortDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
          shortMonths: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        },
        operation: {
          none: 'Attribute value',
          count: 'Count',
          sum: 'Sum',
          cardinality: 'Distinct elements',
          avg: 'Average',
          median: 'Median',
          q1: 'Lower quartile',
          q3: 'Upper Quartile',
          min: 'Minimum',
          max: 'Maximum',
          percent: 'Percent',
          title: 'Operation'
        },
        chooseParameters: 'Please select parameters to display chart.',
        series: 'Series',
        type: 'Chart type',
        title: 'Chart title',
        graphType: {
          'area-default': 'Area',
          'area-with-lines-and-points': 'Curve with lines and points',
          'bar-default': 'Bar',
          'arc-default': 'Circular',
          'line-default': 'Curve',
          'line-with-points': 'Curve with points',
          'arc-donut': 'Donut',
          'bar-histogram': 'Histogram',
          'point-default': 'Points'
        },
        donutSize: 'Donut inner radius',
        abscissa: 'Abscissa',
        ordinate: 'Ordinate',
        dataLabel: 'Data label',
        origin: 'Axis containing 0',
        limit: 'Limit elements',
        asc: 'Biggest elements',
        desc: 'Smallest elements',
        timeInterval: 'Time interval',
        others: 'Regroup remaining values in category "Other"',
        order: 'Component selection',
        groupBy: 'Group by',
        groupAttr: 'Grouping attribute',
        colorScheme: 'Color scheme',
        legend: 'Display legend',
        legendLabel: 'Legend',
        tooltip: 'Display tooltip',
        stacked: 'Vertical stacking',
        noData: 'No selected datasource',
        aggNoResult: 'No results to display',
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
          'KO/W/OK': 'Traffic light'
        },
        time: {
          second: 'Second',
          minute: 'Minute',
          hour: 'Hour',
          day: 'Day',
          week: 'Week',
          month: 'Month',
          quarter: 'Quarter',
          year: 'Year'
        }
      }
    },
    message: {
      'backend-only-1-datasource': 'Aggregation service can only manage the first datasource linked to the widget.',
      'cannot-aggregate-virtual-ds':
        'Aggregation service cannot perform aggregation on virtual datasets such as current search.'
    }
  }
};
