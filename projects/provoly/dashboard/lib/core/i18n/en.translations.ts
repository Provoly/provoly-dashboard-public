export const enTranslations = {
  '@pry': {
    select: {
      label: 'Options list',
      loading: 'Loading'
    },
    about: {
      front: 'Version Front Library : {{value}} ',
      ref: 'Version repository : {{value}}',
      data: 'Version data : {{value}}',
      replay: 'Version replay : {{value}}',
      exec: 'Version Execution : {{value}}',
      transfo: 'Version Transformation : {{value}}',
      noVersion: 'Version not found'
    },
    header: {
      noCurrentPresentation: 'Presentation not saved'
    },
    widget: {
      noData: 'No data source selected',
      unrecognized: 'Restitution of type {{type}} is unknown.',
      addedInView: 'Restitution has been added on tab n°{{index}}',
      updatedInView: 'Restitution has been updated on tab n°{{index}}',
      settings: {
        title: 'Settings',
        changeTitle: 'Widget title',
        validateUpdating: 'Validate-Updating'
      },
      defineCatalog: 'Define catalog entry',
      buttonChoice: 'Select a restitution',
      tooltip: {
        params: 'Parameter restitution presentation',
        readSearch: 'Choose data',
        deleteWidget: 'Delete restitution',
        catalogWidget: 'Add to catalog',
        changeSpot: 'Change widget placement',
        spotName: 'Spot n°{{place}}'
      },
      target: {
        new: 'Open in a new tab',
        existing: 'Open in tab n°{{targetIndex}}',
        delete: 'Delete',
        maximize: 'Maximize',
        none_auto: 'Insert restitutions here',
        none_manual: "Drag 'n' drop",
        loading: 'Loading'
      },
      namedQuery: {
        defaultRs: 'Current search',
        resultsAccurate: '{{total}}',
        resultsNonAccurate: '{{displayed}} of approximately {{total}}'
      },
      modalTitle: 'Do you want to confirm?',
      itemId: 'Id',
      class: 'Class',
      colorScheme: 'Color scheme',
      custom: 'Custom n°{{id}}',
      addColor: 'Add color',
      removeColor: 'Remove color'
    },
    view: {
      name: 'Tab n°{{rank}}'
    },
    toolbox: {
      defaultSize: 'Restitution size',
      manifest: {
        name: 'Presentation name',
        description: 'Presentation description',
        saved: 'Presentation saved as {{viewId}}',
        saveErrorCode: {
          UNKNOWN: 'Unknown error',
          FORBIDDEN: 'You are not the owner of this presentation',
          NAME_ALREADY_USED: 'A presentation called "{{name}}" already exists, please select another name.',
          SAVE_METADATA: 'Save your presentation before choosing the theme.'
        },
        defaulted: 'Presentation {{viewId}} marked as favourite',
        undefaulted: 'Presentation {{viewId}} is no longer marked as favourite',
        validated: 'Validate',
        check: 'Save',
        close: 'Cancel',
        validate: 'Validate'
      },
      catalog: {
        title: 'Custom',
        label: 'Name',
        description: 'Description',
        icon: 'Image',
        filter: {
          delete: 'Cancel filter',
          type: 'Filter by type',
          name: 'Filter by name'
        },
        saved: 'Restitution saved as {{viewId}}',
        saveErrorCode: {
          UNKNOWN: 'Unknown error',
          NAME_ALREADY_USED: 'A restitution called "{{name}}" already exists, please select another name.'
        }
      },
      edit: 'Modify layout',
      editOff: 'Visualize layout',
      launch: 'New tab',
      launchIndication: 'Open this page in a',
      chooseGrid: 'Change grid layout',
      clear: 'Clear presentation',
      refresh: 'Refresh data',
      automateRefresh: 'Automate refresh',
      options: 'Options',
      close: 'Close',
      filter: 'Filter',
      heatmap: 'Heatmap',
      bubblemap: 'Bubbles',
      markermap: 'Markers',
      simplemap: 'Map',
      map: 'Map',
      table: 'Table',
      detail: 'Detail',
      chart: 'Chart',
      resultSet: 'Named Queries',
      rename: 'Save my presentation',
      restore: 'Restore closed pages',
      save: 'Save',
      drag: 'Restitution...',
      dragIndication: 'Insert a',
      barchart: 'Bar',
      histogram: 'Histogram',
      linechart: 'Line',
      pointchart: 'Point',
      areachart: 'Area',
      arcchart: 'Arc',
      radarchart: 'Radar',
      circlechart: 'Circle packing',
      iframe: 'External application',
      vega: 'Advanced chart',
      graph: 'Graph',
      placeholder: '',
      sub: {
        map: 'Map',
        chart: 'Chart',
        other: 'Other'
      },
      tile: 'Tiles',
      template: 'HTML Template',
      now: 'Today',
      since_day: '{{day}} day{{plural}} ago',
      layout: {
        '0': 'Free layout',
        '0_detailled': 'Free mode display, rendering size and positioning fully customizable by the user.',
        '1': 'Fullscreen',
        '1_detailled': 'Display of a single render on the whole screen, the placement is system guided.',
        '1/2v': 'Vertical 1/2',
        '1/2v_detailled':
          'Display of 2 renders maximum, on a screen split in 2 vertical zones, the render addtion is made in an empty zone, the placement is system guided.',
        '1/2h': 'Horizontal 1/2',
        '1/2h_detailled':
          'Display of 2 renders maximum, on a screen split in 2 horizontal zones, the render addtion is made in an empty zone, the placement is system guided.',
        '1/3v': 'Vertical 1/3',
        '1/3v_detailled':
          'Display of 3 renders maximum, on a screen split in 3 vertical zones, the render addtion is made in an empty zone, the placement is system guided.',
        '1/3h': 'Horizontal 1/3',
        '1/3h_detailled':
          'Display of 3 renders maximum, on a screen split in 3 horizontal zones, the render addtion is made in an empty zone, the placement is system guided.',
        '1/4': '1/4 screen',
        '1/4_detailled':
          'Display of 4 renders maximum, on a split screen in 4 zones, the render addtion is made in an empty zone, the placement is system guided.'
      },
      switchEdit: 'Edit',
      switchEditContent: 'Edit composition',
      share: 'Share',
      delete: 'Delete',
      notInDsAttr: 'Unavailable attribute'
    },
    manifest: {
      name: 'Name',
      description: 'Description',
      creation: 'Creation date',
      modification: 'Modification date',
      actions: 'Actions',
      import: 'Import',
      importAlt: 'Import a presentation',
      title: 'Presentations',
      get: {
        errorFront: 'Client error : {{msg}}',
        errorBack: 'Server error with code : [{{code}}]'
      },
      default: 'Set default',
      download: 'Download',
      load: 'Load',
      delete: 'Delete',
      deleteError: 'Search used in one or more restitution(s), please delete them first'
    },
    format: {
      date: 'MM/dd/yyyy',
      datetime: 'MM/dd/yyyy hh:mm:ss a',
      decimal: '.',
      thousands: '.'
    },
    context: {
      add: 'Add to selection',
      remove: 'Remove from selection',
      link: 'Link to selection',
      invert: 'Invert selection',
      proximity: 'Get linked objects',
      explore: 'Open Graph restitution',
      detail: 'Open Detail restitution',
      flyingDetail: 'View object',
      addressFromLoc: 'Get address',
      errorSearchAddress: 'Address not found',
      cancel: 'Cancel',
      create: 'Create',
      createObject: {
        title: {
          object: 'Create an object',
          link: 'Create a link',
          inversion: 'Reverse the link',
          linkedObject: 'Create a linked object'
        },
        class: 'Object class',
        link: 'Link with the new object',
        created: 'Object has been created',
        details: 'See detail',
        addMultiField: 'Add a {{name}} value'
      }
    },
    action: {
      close: 'Close',
      closePanel: 'Close panel',
      delete: 'Delete',
      edit: 'Edit',
      editProfil: 'Edit profil',
      choice: 'Choice',
      choiceInList: 'Choose an item in list',
      text: 'Fill field',
      sortableColumnHeader: 'Use column header buttons to sort',
      viewDetails: 'View details',
      selectDate: 'Select a date',
      opensInNewTab: 'Opens in new tab',
      skipLink: 'Skip to main content',
      selectPicture: 'Select a picture',
      moveDown: 'Move down',
      moveUp: 'Move up',
      exportAsFormat: 'Export as',
      openMenuWidget: 'Restitution menu',
      search: 'Search',
      upload: 'Add image',
      next: 'Next',
      back: 'Back',
      filterByType: 'Filter by type',
      editMetadata: 'Edit metadata',
      addMetadata: 'Add metadata'
    },
    snack: {
      default: 'Vega encountered an error using your data and settings.',
      missingParent: 'A parent node is missing in your dataset. Please fix your data.',
      missingValue: 'An item is missing the value field. Please fix your data.',
      emptyValues: 'Field values cannot be all at 0. Please fix your data.',
      pagesChanged: 'Attention, le nombre de pages de votre présentation a changé, que souhaitez-vous faire ?',
      imageNameAlreadyUsed: 'This image name is already used'
    },
    theme: {
      editInput: {
        toggle: 'Edit'
      },
      previousMonth: 'Previous month',
      nextMonth: 'Next month',
      weekdays: {
        0: 'Monday',
        1: 'Tuesday',
        2: 'Wednesday',
        3: 'Thursday',
        4: 'Friday',
        5: 'Saturday',
        6: 'Sunday'
      },
      shortWeekdays: {
        0: 'Mon',
        1: 'Tue',
        2: 'Wed',
        3: 'Thu',
        4: 'Fri',
        5: 'Sat',
        6: 'Sun'
      },
      months: {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
      }
    },
    share: {
      private: 'Private',
      public: 'Public',
      restricted: 'Restricted',
      type: 'Visibility',
      users: 'Authorized users'
    },
    homepage: {
      menu: {
        model: 'Data model',
        data: 'Data access'
      }
    },
    metadata: {
      view: 'View metadata'
    },
    components: {
      chipsSelector: {
        datasource: {
          select: 'Select one or more data source(s):',
          selection: 'Selected data source(s):',
          selectItem: 'Select this data source',
          unselectItem: 'Unselect this data source',
          noItemSelected: 'No data source selected'
        },
        share: {
          select: 'Select one or more user group:',
          selection: 'Selected user groups:',
          selectItem: 'Select this user group',
          unselectItem: 'Unselect this user group',
          noItemSelected: 'No user group selected',
          groups: {
            ALL: 'Public',
            AUTHENTICATED: 'Connected users'
          }
        }
      },
      searchData: 'Search'
    },
    errors: {
      default: 'There is an error. Try again or contact your administrator',
      codes: {
        0: 'An error occurred on client-side. This may be caused by CORS, network error, ... Resource cannot be reached.',
        400: 'An error occurred.',
        401: 'Session expired. Try to reconnect!',
        403: 'Access unauthorized',
        404: 'Ressource not found',
        409: 'Ressource already exist',
        500: 'An error occurred.',
        503: 'Service unavailable. try again later!'
      }
    },
    filters: {
      label: 'Filter settings',
      noAttributes: 'Presentation had no available attributes',
      noFilters: 'No filters set up for this presentation yet.',
      clear: 'Clear all',
      list: {
        attributes: 'Attributes: ',
        add: 'Add filter',
        delete: 'Delete',
        modify: 'Modify'
      },
      creation: {
        create: 'New filter',
        update: 'Edit filter',
        name: 'Filter name',
        type: 'Filter type',
        filter: 'Filter',
        attributes: 'Attributes',
        value: 'Value',
        values: 'Values',
        validate: 'Confirm',
        limit: 'Autocomplete proposals',
        dateRange: 'Date range'
      },
      attributes: {
        datasource: 'Datasource',
        class: 'Classe',
        operator: 'Operator'
      },
      types: {
        text: 'Text',
        date: 'Date',
        list: 'List',
        number: 'Number',
        autocomplete: 'Autocomplete'
      }
    },
    geoAuth: {
      failure: 'Geoserver error'
    }
  }
};
