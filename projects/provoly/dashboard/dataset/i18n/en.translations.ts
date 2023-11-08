export const enTranslations = {
  '@pry': {
    dataset: {
      consult: 'View',
      title: 'Dataset catalog',
      search: 'Search',
      date: 'Date',
      status: 'Status',
      versionHistory: 'Version history',
      data: 'Data',
      table: 'Table',
      map: 'Map',
      export: 'Export',
      api: 'API',
      returnToList: 'Back to catalog',
      refresh: 'Refresh',
      since_day:'Last update :',
      version: {
        title: 'Title',
        INDEXING: 'Loading',
        LOADING: 'Loading',
        INACTIVE: 'Invalid',
        ERROR: 'Error',
        ACTIVE: 'Available',
        currentlyActive: 'Active'
      },
      buttonAction: {
        ACTIVE: 'Invalidate',
        INACTIVE: 'Validate',
        ERROR: 'Consult errors',
        WARNING: 'Consult warnings',
        LOADING: '',
        INDEXING: ''
      },
      error: {
        type: 'Type',
        elements: 'Elements',
        message: 'Message',
        close: 'Fermer',
        modalTitle: {
          ERROR: 'List of errors',
          WARNING: 'List of warnings'
        },
        level: {
          ERROR: 'Error',
          WARNING: 'Warning'
        },
        code: {
          UNRECOGNIZED: 'Unrecognized attribute{{plural}} {{name}}',
          FORMAT: 'Wrong format for attribute {{name}}',
          STORAGE: 'Insertion error for element {{recordId}}',
          NO_VALUES: 'No value for {{recordId}} line',
          FORMAT_FILE_ERROR: 'Unsupported file format',
          NO_ATTRIBUTES: 'The imported data does not correspond to the data model indicated in the import target'
        }
      },
      tooltip: {
        error: 'Errors occurred when integrating the data into the solution. The data is not accessible',
        active: 'The data retrieved by default in the application corresponds to the data integrated in this version.',
        inactive:
          'The data for this version is available but not uploaded by default. It is possible to display them by explicitly requesting this version.',
        loading: 'The data is currently being integrated into the solution',
        invalid:
          'The data in this version is present in the solution but is not relevant. It is not available are not available for display',
        inValidateButton:
          'Allows you to make the version\'s data unavailable if it is considered irrelevant from a business point of view. If the invalidated version is the active version, then the data retrieved by default will be that of the most recent previous "Available" version, which will thus change to "Active" status.',
        validateButton:
          "Allows the version's data to be made available if it is considered relevant from a business point of view after having been invalidated. If the validated version is the most recent, it will become the active version and its data will be the default."
      }
    }
  }
};
