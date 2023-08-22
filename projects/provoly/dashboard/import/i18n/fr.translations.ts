export const frTranslations = {
  '@pry': {
    import: {
      title: 'Import de données',
      datasetImport: 'Importer dans un jeu de données:',
      import: 'Importer',
      errorTitle: "L'import a échoué",
      successTitle: 'Import de données réussi',
      uploadTitle: 'Choisir un fichier .',
      selectFile: 'Sélectionner un fichier',
      importedLines: 'lignes importée(s)',
      consultDataset: "L'import est en cours, consultez la page du jeu de données {{parameter}} pour vérifier son état",
      shapefileState: ' pour vérifier son état',
      error: "Erreur lors de l'import: {{msg}}",
      errors: 'erreur(s)',
      line: 'Ligne {{line}}: ',
      withoutLine: 'Erreurs globales: ',
      dataset: 'Jeu de données',
      fileType: 'Sélectionner un type de fichier',
      code: {
        UNRECOGNIZED:
          "Le fichier fourni contient une colonne «\u00A0{{name}}\u00A0», qui n'est pas présente dans le jeu de données choisi",
        FILE_MANDATORY: 'Aucun fichier fourni',
        NB_ATTRIBUTES:
          "Le nombre des colonnes dans le fichier fourni ne correspond pas au nombre d'attributs dans le jeu de données choisi",
        CAST: "La valeur «\u00A0{{name}}\u00A0», n'a pas pu être convertie en type «\u00A0{{type}}\u00A0»,",
        ELASTIC_SEARCH: 'Elastic Search stack trace error: {{elasticError}}'
      }
    }
  }
};
