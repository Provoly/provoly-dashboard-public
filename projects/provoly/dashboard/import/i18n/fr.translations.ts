export const frTranslations = {
  '@pry': {
    importList: {
      title: 'Liste des données intégrées',
      filter: {
        dsName: 'Nom',
        status: 'Status import',
        date: 'Date import'
      },
      dsName: 'Nom',
      date: 'Date de création de la version',
      number: 'N° Version',
      status: 'Status de version',
      actions: 'Actions'
    },
    import: {
      title: 'Import de données',
      datasetImport: 'Importer dans un jeu de données:',
      import: 'Importer',
      errorTitle: "L'import a échoué",
      successTitle: 'Import de données réussi',
      uploadTitlezip: 'Choisir un fichier .zip',
      uploadTitlecsv: 'Choisir un fichier .csv',
      warning:
        'Attention, le fichier ne doit pas dépasser 2GB pour être intégrer via cet écran. Le cas échéant, votre fichier devra être importé via les API',
      tooLarge: 'Fichier trop volumineux ({{current}} > 2GB), veuillez utiliser les API pour importer ces données',
      selectFile: 'Sélectionner un fichier',
      importedLines: 'lignes importée(s)',
      consultDataset1: "L'import est en cours, consultez la page du jeu de données ",
      consultDataset2: ' pour vérifier son état',
      shapefileState: ' pour vérifier son état',
      error: "Erreur lors de l'import: {{msg}}",
      errors: 'erreur(s)',
      errorCode: {
        409: 'Import déjà en cours, veuillez réessayer plus tard.'
      },
      line: 'Ligne {{line}}: ',
      withoutLine: 'Erreurs globales: ',
      dataset: 'Jeu de données',
      fileType: 'Sélectionner un type de fichier',
      code: {
        UNRECOGNIZED:
          "Le fichier fourni contient une colonne «\u00A0{{name}}\u00A0», qui n'est pas présente dans le jeu de données choisi",
        FILE_MANDATORY: 'Aucun fichier fourni',
        NO_ATTRIBUTES: "Aucun attribut correspondant n'a été trouvé dans le fichier fourni",
        FORMAT:
          "«\u00A0{{name}}\u00A0»: «\u00A0{{receivedValue}}\u00A0»  n'a pas pu être convertie en type «\u00A0{{type}}\u00A0»",
        STORAGE: 'Storage stack trace error: {{elasticError}}'
      },
      normalize: 'Normaliser les formes géographiques',
      multiple: 'Import multiple'
    }
  }
};
