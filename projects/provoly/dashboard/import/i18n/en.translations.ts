export const enTranslations = {
  '@pry': {
    import: {
      title: 'Import data',
      datasetImport: 'Import in :',
      import: 'Import',
      errorTitle: 'Import failed',
      successTitle: 'Import successful',
      uploadTitle: 'Choose a .csv file',
      selectFile: 'Select file',
      importedLines: 'imported lines',
      errors: 'errors',
      error: 'Error on import: {{msg}}',
      line: 'Line {{line}}: ',
      withoutLine: 'Global errors: ',
      dataset: 'Dataset',
      fileType: 'Select file type',
      code: {
        UNRECOGNIZED: 'Provided file contains a column "{{name}}", which is not present in the chosen dataset',
        FILE_MANDATORY: 'No file was provided',
        NB_ATTRIBUTES:
          'The number of columns in the file does not match the number of attributes in the chosen dataset',
        CAST: 'Value {{name}} could not be casted to type "{{type}}"',
        ELASTIC_SEARCH: 'Elastic Search error: {{elasticError}}'
      }
    }
  }
};
