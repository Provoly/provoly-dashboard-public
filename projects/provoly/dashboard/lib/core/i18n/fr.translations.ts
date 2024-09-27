export const frTranslations = {
  '@pry': {
    select: {
      label: 'Liste des choix',
      loading: 'Chargement en cours',
      empty: 'Aucun résultat trouvé'
    },
    about: {
      front: 'Librairie front',
      ref: 'Référentiel',
      data: 'Données',
      replay: 'Rejeu',
      exec: 'Exécution',
      transfo: 'Transformation',
      noVersion: 'Version non trouvée'
    },
    header: {
      noCurrentPresentation: 'Présentation non sauvegardée'
    },
    widget: {
      noData: 'Aucune source de données sélectionnée',
      unrecognized: 'La restitution de type {{type}} est inconnu.',
      addedInView: 'La restitution a été ajoutée sur la page n°{{index}}',
      updatedInView: 'La restitution a été mise à jour sur la page n°{{index}}',
      settings: {
        title: 'Paramétrage',
        changeTitle: 'Titre de la restitution',
        validateUpdating: 'Valider la modification'
      },
      defineCatalog: 'Définissez votre entrée de catalogue',
      buttonChoice: 'Sélectionner une restitution',
      tooltip: {
        params: 'Paramétrer la vue de votre restitution',
        readSearch: 'Choisir les données',
        deleteWidget: 'Supprimer votre restitution',
        catalogWidget: 'Ajouter au catalogue',
        changeSpot: "Changer d'emplacement",
        spotName: 'Emplacement n°{{place}}'
      },
      target: {
        new: 'Ouvrir dans une nouvelle page',
        existing: 'Ouvrir dans la page n°{{targetIndex}}',
        delete: 'Supprimer',
        maximize: 'Maximiser',
        none_auto: 'Insérez ici vos restitutions',
        none_manual: 'Glisser - Déposer',
        loading: 'Chargement'
      },
      namedQuery: {
        defaultRs: 'Recherche courante',
        resultsAccurate: '{{total}}',
        resultsNonAccurate: '{{displayed}} sur environ {{total}}'
      },
      modalTitle: 'Voulez-vous confirmer ?',
      itemId: 'Id',
      class: 'Classe',
      colorScheme: 'Schéma de couleur',
      custom: 'Personalisé n°{{id}}',
      addColor: 'Ajouter une couleur',
      removeColor: 'Supprimer une couleur'
    },
    view: {
      name: 'Page n°{{rank}}'
    },
    toolbox: {
      defaultSize: 'Taille de restitution',
      analytic: 'Tableau analytique',
      manifest: {
        name: 'Nom de la présentation',
        description: 'Description de la présentation',
        saved: 'Présentation {{viewId}} sauvegardée',
        saveErrorCode: {
          UNKNOWN: 'Erreur inconnue',
          FORBIDDEN: "Vous n'êtes pas le propriétaire de cette présentation ",
          NAME_ALREADY_USED: 'Une présentation avec le nom "{{name}}" existe déjà, veuillez sélectionner un autre nom.',
          SAVE_METADATA: 'Veuillez sauvegarder la presentation avant de choisir une thématique.'
        },
        defaulted: 'Présentation {{viewId}} marquée par défaut',
        undefaulted: "La présentation {{viewId}} n'est plus marquée par défaut",
        validated: 'Valider',
        check: 'Enregistrer',
        close: 'Annuler',
        validate: 'Valider',
        all: 'Tous'
      },
      catalog: {
        title: 'Personnalisés',
        label: 'Nom',
        description: 'Description',
        icon: 'Image',
        filter: {
          delete: 'Supprimer ce filtre',
          type: 'Filtrer par type',
          name: 'Filtrer par nom'
        },
        saveErrorCode: {
          UNKNOWN: 'Erreur inconnue',
          NAME_ALREADY_USED: 'Une restitution avec le nom "{{name}}" existe déjà, veuillez sélectionner un autre nom.'
        },
        saved: 'Présentation {{viewId}} sauvegardée'
      },
      about: 'Informations',
      apply: 'Appliquer',
      edit: 'Modifier la disposition',
      editOff: 'Visualiser la disposition',
      editPresentation: 'Modifier les informations',
      launch: 'Nouvelle page',
      launchIndication: 'Ouvrir cette page dans un',
      chooseGrid: 'Changer la grille',
      clear: "Vider l'affichage",
      refresh: 'Rafraichir les données',
      automateRefresh: "Automatiser l'actualisation",
      options: 'Options',
      close: 'Fermer',
      filter: 'Filtrer',
      heatmap: 'Fréquentation',
      bubblemap: 'Bulles',
      markermap: 'Marqueurs',
      simplemap: 'Carte',
      map: 'Carte',
      table: 'Tableau',
      detail: 'Détail',
      chart: 'Graphique',
      resultSet: 'Recherches nommées',
      rename: 'Enregistrer sous {{ nbPages }}',
      restore: 'Restaurer les pages',
      save: 'Enregistrer {{ nbPages }}',
      drag: 'Restitution...',
      dragIndication: 'Insérer un',
      barchart: 'Barres',
      histogram: 'Histogramme',
      linechart: 'Courbe',
      pointchart: 'Points',
      areachart: 'Aire',
      arcchart: 'Circulaire',
      radarchart: 'Radar',
      circlechart: 'Paquets de cercles',
      iframe: 'Application externe',
      vega: 'Graphique avancé',
      graph: 'Relations',
      placeholder: '',
      sub: {
        map: 'Cartographie',
        chart: 'Graphique',
        other: 'Autre'
      },
      tile: 'Tuiles',
      template: 'Template HTML',
      today: "Aujourd'hui à {{hour}}:{{min}}",
      since_day: 'Il y a {{day}} jour{{plural}}',
      from_day: 'Dans {{day}} jour{{plural}}',
      layout: {
        '0': 'Composition libre',
        '0_detailled':
          "Affichage en mode libre, la taille et le positionnement des restitutions sont entièrement paramétrables par l'utilisateur.",
        '1': 'Plein écran',
        '1_detailled':
          "Affichage d’une seule restitution sur l'ensemble de l'écran, le placement est guidé par le système.",
        '1/2v': '1/2 écran vertical',
        '1/2v_detailled':
          "Affichage de 2 restitutions maximum sur l'écran découpé en deux zones verticales, l'ajout de restitution se fait dans les zones vides. Le placement est guidé par le système.",
        '1/2h': '1/2 écran horizontal',
        '1/2h_detailled':
          "Affichage de 2 restitutions maximum sur l’écran découpé en deux zones horizontales, l'ajout de restitution se fait dans les zones vides. Le placement est guidé par le système.",
        '1/3v': '1/3 écran vertical',
        '1/3v_detailled':
          "Affichage de 3 restitutions maximum sur l’écran découpé en trois zones verticales, l'ajout de restitution se fait dans les zones vides. Le placement est guidé par le système.",
        '1/3h': '1/3 écran horizontal',
        '1/3h_detailled':
          "Affichage de 3 restitutions maximum sur l’écran découpé en trois zones horizontales, l'ajout de restitution se fait dans les zones vides. Le placement est guidé par le système.",
        '1/4': '1/4 écran',
        '1/4_detailled':
          "Affichage de 4 restitutions maximum sur l’écran découpé en quatre zones , l'ajout de restitution se fait dans les zones vides. Le placement est guidé par le système."
      },
      switchEdit: 'Modifier',
      switchEditContent: 'Modifier la construction',
      share: 'Partager',
      shareAccessRights: "Droits d'accès",
      delete: 'Supprimer',
      notInDsAttr: 'Attribut indisponible'
    },
    manifest: {
      name: 'Nom',
      description: 'Description',
      creation: 'Date de création',
      modification: 'Date de modification',
      actions: 'Actions',
      import: 'Importer',
      importAlt: 'Importer une présentation',
      title: 'Présentations',
      get: {
        errorFront: 'Erreur client : {{msg}}',
        errorBack: 'Erreur serveur de code [{{code}}]'
      },
      default: 'Définir par défaut',
      download: 'Télécharger',
      load: 'Charger',
      delete: 'Supprimer',
      deleteError:
        "Recherche utilisée dans une ou plusieurs restitution(s), veuillez supprimer les utilisations d'abord"
    },
    format: {
      date: 'dd/MM/yyyy',
      datetime: 'dd/MM/yyyy HH:mm:ss',
      decimal: ',',
      thousands: ' '
    },
    context: {
      add: 'Ajouter à la sélection',
      remove: 'Enlever de la sélection',
      link: 'Lier à la sélection',
      invert: 'Inverser la sélection',
      proximity: 'Rechercher les objets liés',
      explore: 'Ouvrir la restitution Relations',
      detail: 'Ouvrir la restitution Détail',
      flyingDetail: "Consulter l'objet",
      addressFromLoc: "Obtenir l'adresse",
      errorSearchAddress: 'Adresse introuvable',
      cancel: 'Annuler',
      create: 'Créer',
      createObject: {
        title: {
          object: 'Créer un objet',
          link: 'Créer une relation',
          inversion: 'Inverser la relation',
          linkedObject: 'Créer un objet lié'
        },
        class: "Classe de l'objet",
        link: 'Relation avec le nouvel objet',
        created: "L'objet a été créé",
        details: 'Voir le détail',
        addMultiField: 'Ajouter une valeur de {{name}}'
      }
    },
    action: {
      add: 'Ajouter',
      close: 'Fermer',
      closePanel: 'Fermer le panneau',
      delete: 'Supprimer',
      edit: 'Editer',
      editProfil: 'Editer le profil',
      editTitle: 'Editer le titre',
      choice: 'Choisir un ....',
      choiceInList: 'Choisir un élément dans la liste',
      text: 'Remplir le champ',
      sortableColumnHeader: "Utilisez les boutons d'en-tête de colonne pour trier.",
      viewDetails: 'Voir les détails',
      selectDate: 'Choisir une date',
      opensInNewTab: "S'ouvre dans une nouvelle fenêtre",
      skipLink: 'Aller au contenu',
      selectPicture: 'Sélectionner une image',
      moveDown: 'Déplacer vers le bas',
      moveUp: 'Déplacer vers le haut',
      exportAsFormat: 'Exporter au format',
      openMenuWidget: 'Menu de la restitution',
      search: 'Rechercher',
      upload: 'Ajouter une image',
      next: 'Suivant',
      back: 'Retour',
      filterByType: 'Filtrer par type',
      editMetadata: 'Modifier la métadonnée',
      addMetadata: 'Ajouter la métadonnée',
      yes: 'Oui',
      no: 'Non'
    },
    snack: {
      default: 'Vega a rencontré une erreur en utilisant vos données et paramétrage.',
      missingParent: "Un noeud est manquant dans l'arbre de représentation. Merci de corriger vos données.",
      missingValue: "Un item à afficher ne possède pas l'attribut à afficher. Merci de corriger vos données.",
      emptyValues: "Les valeurs de l'attribut à afficher ne peuvent être toutes nulles. Merci de corriger vos données.",
      pagesChanged: 'Attention, le nombre de pages de votre présentation a changé, que souhaitez-vous faire ?',
      imageNameAlreadyUsed: 'Le nom de cette image est déjà utilisé'
    },
    theme: {
      editInput: {
        toggle: 'Editer',
        confirm: 'Confirmer'
      },
      previousMonth: 'Mois précédent',
      nextMonth: 'Mois suivant',
      weekdays: {
        0: 'Lundi',
        1: 'Mardi',
        2: 'Mercredi',
        3: 'Jeudi',
        4: 'Vendredi',
        5: 'Samedi',
        6: 'Dimanche'
      },
      shortWeekdays: {
        0: 'Lu',
        1: 'Ma',
        2: 'Me',
        3: 'Je',
        4: 'Ve',
        5: 'Sa',
        6: 'Di'
      },
      months: {
        0: 'Janvier',
        1: 'Février',
        2: 'Mars',
        3: 'Avril',
        4: 'Mai',
        5: 'Juin',
        6: 'Juillet',
        7: 'Août',
        8: 'Septembre',
        9: 'Octobre',
        10: 'Novembre',
        11: 'Décembre'
      }
    },
    share: {
      iconLabel: {
        PRIVATE: 'Privé',
        GROUPS: "Partagé aux groupes d'utilisateurs",
        PUBLIC: 'Public'
      },
      radioLabel: {
        PRIVATE: 'Privé',
        GROUPS: 'Restreint',
        PUBLIC: 'Public'
      },
      type: 'Visibilité',
      users: 'Utilisateurs autorisés',
      groupLabels: {
        ALL: 'Tout le monde',
        AUTHENTICATED: 'Les utilisateurs connectés'
      },
      noGroups: 'Aucun groupe disponible',
      conflict: {
        title: 'Warning',
        main: 'Attention, les sources de données suivantes ne seront pas visible de toutes les personnes accédant à la présentation : ',
        unavailable: 'inaccessible aux groupes : '
      },
      dashboardAccess: "Donner les droits d'accès de ce tableau de bord à certains groupes d’utilisateurs :",
      placeholder: 'Choisissez le ou les groupes utilisateurs',
      read: 'Peut voir',
      write: 'Peut modifier',
      accessDescription:
        '"Peut voir" ouvre les droits de consultation et "Peut modifier" permet de consulter et modifier',
      me: 'Moi',
      owner: 'Propriétaire'
    },
    homepage: {
      menu: {
        model: 'Modèle de données',
        data: 'Accès aux données'
      }
    },
    metadata: {
      view: 'Consulter les metadonnées'
    },
    components: {
      searchData: 'Recherchez une donnée',
      chipsSelector: {
        share: {
          select: "Sélectionner un ou plusieurs groupe(s) d'utilisateurs :",
          selection: "Groupe(s) d'utilisateurs sélectionnés:",
          selectItem: "Sélectionner le groupe d'utilisateurs",
          unselectItem: "Désélectionner le groupe d'utilisateurs",
          noItemSelected: "Aucun groupe d'utilisateurs sélectionné"
        }
      },
      datasourceSelector: {
        select: 'Choisir les données',
        selection: 'Source(s) de données sélectionnées:',
        selectItem: 'Sélectionner la source de données',
        unselectItem: 'Désélectionner la source de données',
        noItemSelected: 'Aucune source de données sélectionnée'
      }
    },
    errors: {
      default:
        'Une erreur est survenue. Veuillez vérifiez les informations ou contacter votre administrateur si le problème persiste',
      codes: {
        0: 'Une erreur est survenue au niveau navigateur. Cela peut-être une erreur CORS, de réseau ... La ressource ne peut pas être récupérée.',
        400: 'Une erreur est survenue.',
        401: 'Votre session est invalide. Essayez de vous reconnecter !',
        403: "Vous n'avez pas les droits pour consulter cette ressource",
        404: "La ressource demandée n'existe pas",
        409: 'Une ressource similaire existe déjà',
        500: 'Une erreur est survenue.',
        503: 'Le service est actuellement indisponible. Réessayer ultérieurement !'
      }
    },
    filters: {
      label: 'Paramétrer les filtres',
      noAttributes: "La présentation en cours ne dispose d'aucune attribut sur lequel filtrer",
      noFilters: "Vous n'avez pas encore paramétré de filtre.",
      clear: 'Effacer',
      list: {
        attributes: 'Attributs: ',
        add: 'Créer un filtre',
        delete: 'Supprimer',
        modify: 'Modifier'
      },
      creation: {
        create: 'Créer un filtre',
        update: 'Modifier un filtre',
        name: 'Nom du filtre',
        type: 'Type du filtre',
        filter: 'Filtre',
        attributes: 'Attributs',
        value: 'Valeur',
        values: 'Valeurs',
        validate: 'Valider',
        limit: "Nombre de suggestions proposées à l'utilisateur",
        dateRange: 'Plage de dates'
      },
      attributes: {
        datasource: 'Datasource',
        class: 'Classe',
        operator: 'Opérateur'
      },
      types: {
        text: 'Texte',
        date: 'Date',
        list: 'Liste',
        number: 'Numérique',
        autocomplete: 'Liste avec suggestion'
      }
    },
    geoAuth: {
      failure: 'Erreur geoserver'
    },
    grid: {
      rows: 'Lignes',
      columns: 'Colonnes'
    },
    a11y: {
      modalStatusTableDescr: 'Les warnings et les erreurs de la version de dataset'
    },
    dataset: {
      version: {
        title: 'Intitulé',
        name: 'Nom de la source de données',
        productionDate: 'Date de production',
        lastModifiedDate: 'Date de dernière modification',
        number: 'Numéro de version',
        producer: 'Producteur de données',
        additionalInformation: 'Informations de la version',
        fileName: 'Nom du fichier source',
        notProvided: 'Non renseigné',
        stateTitle: 'Statut',
        state: {
          INDEXING: 'En chargement',
          LOADING: 'En chargement',
          INACTIVE: 'Invalide',
          ERROR: 'En erreur',
          ACTIVE: 'Disponible',
          DELETING: 'En cours de suppression',
          DELETE_ERROR: 'Erreur de suppression',
          currentlyActive: 'Actif'
        },
        stateFilter: {
          INDEXING: 'En chargement (indexing)',
          LOADING: 'En chargement (loading)',
          INACTIVE: 'Invalide',
          ERROR: 'En erreur',
          ACTIVE: 'Disponible',
          DELETING: 'En cours de suppression',
          DELETE_ERROR: 'Erreur de suppression'
        }
      }
    }
  }
};
