export const frTranslations = {
  '@pry': {
    dataset: {
      consult: 'Consulter',
      title: 'Catalogue des jeux de données',
      search: 'Rechercher',
      date: 'Date',
      status: 'Statut',
      versionHistory: 'Historique de versions',
      data: 'Données',
      table: 'Tableau',
      map: 'Carte',
      export: 'Export',
      api: 'API',
      returnToList: 'Retour au catalogue',
      refresh: 'Actualiser',
      version: {
        title: 'Intitulé',
        INDEXING: 'En chargement',
        LOADING: 'En chargement',
        INACTIVE: 'Invalide',
        ERROR: 'En erreur',
        ACTIVE: 'Disponible',
        currentlyActive: 'Actif'
      },
      buttonAction: {
        ACTIVE: 'Invalider',
        INACTIVE: 'Valider',
        ERROR: 'Consulter erreurs',
        WARNING: 'Consulter warnings',
        LOADING: '',
        INDEXING: ''
      },
      error: {
        ERROR: 'Erreur',
        WARNING: 'Warning',
        type: 'Type',
        elements: 'Elements',
        message: 'Message',
        close: 'Fermer',
        modalTitle: {
          ERROR: 'Liste des erreurs',
          WARNING: 'Liste des warnings'
        },
        level: {
          ERROR: 'Erreur',
          WARNING: 'Warning'
        },
        code: {
          UNRECOGNIZED: 'Attribut{{plural}} {{name}} non reconnu{{plural}}',
          FORMAT: "Format d'attribut {{name}} incorrect",
          ELASTIC_SEARCH: "Erreur d'insertion pour l'élément {{recordId}}",
          NO_VALUES: 'Pas de valeur pour la ligne {{recordId}}',
          FORMAT_FILE_ERROR: "Le format du fichier transmis n'est pas géré",
          NO_ATTRIBUTES: "Les données importées ne correspondent pas au modèle de données indiquer en cible de l'import"
        }
      },
      tooltip: {
        error:
          "Des erreurs sont apparues lors de l'intégration des données dans la solution. Les données ne sont pas accessibles",
        active:
          "Les données remontées par défaut dans l'application correspondent à celles intégrées dans cette version",
        inactive:
          'Les données de cette version sont disponibles mais non remontées par défaut. Il est possible de les afficher en demandant explicitement cette version.',
        loading: "Les données sont en cours d'intégration dans la solution",
        invalid:
          "Les données de cette version sont présentes dans la solution mais sont non pertinentes. Elles ne sont pas disponibles pour l'affichage",
        inValidateButton:
          'Permet de rendre indisponible les données de la version dans le cas où elles sont considérées comme non pertinente d\'un point de vue métier. Si la version invalidée est la version active, alors les données récupérées par défaut seront celle de la version "Disponible" précédente la plus récente qui passera ainsi au statut "Active"',
        validateButton:
          "Permet de rendre disponible les données de la version dans le cas où elles sont considérées comme pertinente d'un point de vue métier après avoir été invalider. Si la version validée est la plus récente, elle deviendra ainsi la version active et ses données seront celles remontées par défaut"
      }
    }
  }
};
