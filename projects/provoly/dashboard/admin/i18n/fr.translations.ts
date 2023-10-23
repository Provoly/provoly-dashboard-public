export const frTranslations = {
  '@pry': {
    admin: {
      title: 'Administration',
      titleIndication: 'Fermer le menu Administration',
      infoModalTitle: 'Information',
      closeModale: 'Fermer',
      edit: 'Modifier',
      rename: 'Renommer',
      delete: 'Supprimer',
      add: 'Nouveau',
      validate: 'Valider',
      addClass: 'Valider la création',
      addAttribute: 'Ajouter un attribut',
      create: 'Créer',
      upload: 'Ajouter une image',
      cancel: 'Annuler',
      back: 'Retour',
      next: 'Suivant',
      properties: 'Propriétés',
      details: 'Détails',
      activity: 'Activité',
      required: 'Le champs est requis',
      exists: 'Ce nom est déjà utilisé',
      minLength: 'Nombre minimal de caractères : {{len}}',
      maxLength: 'Nombre de caractères autorisé : {{len}}',
      noWhitespace: 'La valeur ne peut pas commencer ou finir par un espace.',
      rule: 'Règle n°{{id}}',
      defaultRule: "Règle par défaut (ne s'applique que si aucune autre règle n'est validée)",
      displayModeImage: "Mode d'affichage de l'image",
      size: "Taille de l'image",
      deleteAttributeConfirmMessage:
        'Cet attribut ne sera plus visible pour les données le possédant. Confirmez-vous la suppression ?',
      position: {
        FULL: 'Icone pleine',
        TOP_LEFT: 'En haut à gauche',
        TOP_RIGHT: 'En haut à droite',
        BOTTOM_LEFT: 'En bas à gauche',
        BOTTOM_RIGHT: 'En bas à droite'
      },
      customize: {
        title: 'Personnaliser',
        template: 'Tooltip (Carte & Graphe)',
        update: 'Mettre à jour le tooltip',
        advanced: 'Mode avancé',
        name: 'Modèle métier',
        technicalId: 'Id technique',
        type: 'Choisissez le type de tooltip à utiliser',
        simplified: 'Choisissez les attributs à afficher',
        exemple: 'valeur de {{expr}}',
        table: 'Attributs par défaut (Table)',
        tile: 'Attributs affichés sur la tuile',
        tileHint: 'Seulement entre 1 et {{max}} attributs peuvent être affichés dans une tuile',
        tableAttrs: 'Attributs dans la table par défaut',
        tileAttrs: 'Attributs présentés dans les tuiles',
        noTableAttrs: 'Autres attributs',
        noTileAttrs: 'Attributs non affichés',
        updateTable: "Mettre à jour les attributs par défaut d'une table",
        updateTile: 'Mettre à jour les attributs des tuiles',
        updateIcons: 'Mettre à jour les règles de symboles'
      },
      varType: {
        int: 'Nombre entier',
        double: 'Nombre décimal',
        string: 'Texte',
        uuid: 'Identifiant uuid',
        date: 'Date',
        list: 'Liste de valeurs'
      },
      menus: {
        environment: "Contextes d'exécution",
        user: 'Utilisateurs',
        'metadata-user': 'Profil utilisateur',
        'abac-rules': 'Règles ABAC',
        'metadata-rules': 'Règles Métadonnées',
        dataset: 'Jeux de données',
        classes: 'Modèles de données',
        predicates: 'Prédicats',
        metadata: 'Métadonnées',
        fields: 'Types métier',
        'relation-types': 'Types de relation',
        links: 'Lien entre attributs',
        model: 'Modèle métier',
        access: 'Accès aux données'
      },
      predicates: {
        list: 'Prédicats',
        add: 'Créer un nouveau prédicat',
        edit: 'Modifier un prédicat',
        info: 'Détails du prédicat',
        num: 'Id.',
        name: 'Nom',
        value: 'Expression conditionnelle de déclenchement',
        validEdit: 'Information',
        validEditMessage: 'Ce prédicat est utilisé dans {{used}} règles. Voulez-vous vraiment le modifier ?'
      },
      metadata: {
        title: 'Metadonnées',
        add: 'Créer une metadonnée',
        edit: 'Modifier une metadonnée',
        details: 'Détails de la metadonnée',
        detailsUser: 'Détails du profil utilisateur',
        id: 'ID',
        label: 'Nom',
        type: 'Type',
        description: 'Description',
        invalid: 'Le champs est requis',
        listLabel: 'Nom de la valeur',
        addValue: 'Ajouter une nouvelle valeur',
        removeValue: 'Supprimer cette valeur',
        system: 'Métadonnée système'
      },
      'metadata-rules': {
        title: 'Règles Metadonnées',
        label: 'Nom',
        'is-same-name': 'Le nom de la règle est déjà pris pour une autre règle, veuillez en utiliser un autre',
        'is-same-rules': "La même règle a déjà été configurée et enregistrée, vous pouvez l'utiliser",
        'metadata-item': {
          name: 'Metadonnées cible',
          description: 'Description de la metadonnée cible',
          type: 'Type de la metadonnée cible'
        },
        'metadata-user': {
          name: 'Profil utilisateur source',
          description: 'Description du profil utilisateur source',
          type: 'Type du profil utilisateur source'
        },
        edit: {
          title: 'Modifier une règle de metadonnées'
        },
        add: {
          title: 'Créer une nouvelle règle de metadonnées'
        }
      },
      dataset: {
        delete:
          "L'ensemble des versions et des données associées seront supprimées. Les restitutions et présentations utilisant ce jeu de données n'afficheront plus les données correspondantes. Confirmez-vous la suppression ?",
        title: 'Jeux de données',
        id: 'Identifiant',
        name: 'Nom',
        oClass: 'Modèle métier',
        type: 'Type',
        'is-same-name': 'Le nom du jeu de données est déjà pris, veuillez en utiliser un autre',
        add: {
          title: 'Créer un jeu de données'
        },
        edit: {
          title: 'Modifier un jeu de données'
        },
        OPEN: 'Ouvert',
        CLOSED: 'Fermé',
        MODIFIABLE: 'Modifiable'
      },
      'abac-rules': {
        delete: 'Supprimer',
        metadataUser: 'Profil utilisateur',
        title: {
          list: 'Règles Abac',
          add: 'Créer une règle abac',
          view: "Détails d'une règle abac",
          edit: 'Modifier une règle abac'
        },
        form: {
          id: 'Numéro',
          name: 'Nom',
          description: 'Description',
          status: 'Statut',
          statusActive: 'Actif',
          statusInactive: 'Inactif',
          predicate: 'Prédicat de déclenchement',
          type: 'Type',
          typeMetadata: 'Metadonnée',
          typeAttribute: 'Attribut',
          typeSelected: 'Vous ne pouvez pas changer le type avec les conditions existantes',
          addMetadata: 'Ajouter une condition sur une metadonnée',
          addAttribute: 'Ajouter une condition sur un attribut',
          toggleAnd: 'ET',
          toggleOr: 'OU',
          addGroup: 'Ajouter un sous-groupe'
        }
      },
      user: {
        title: 'Profil utilisateur',
        add: 'Créer un nouveau profil utilisateur',
        label: 'Nom',
        type: 'Type',
        invalid: 'Le champ est requis',
        edit: 'Modifier un profil utilisateur'
      },
      environment: {
        list: "Contextes d'exécution",
        add: "Créer un nouveau contexte d'exécution",
        edit: "Modifier un contexte d'exécution",
        info: "Détails du contexte d'exécution",
        formatInt: 'La valeur doit être un entier.',
        formatDouble: "La valeur doit être un entier, le séparateur autorisé est un '.'",
        formatName: 'Caractères speciaux autorisés: [ -, _ ] ',
        name: 'Nom',
        type: 'Type',
        value: 'Valeur de la variable'
      },
      classes: {
        list: 'Modèles de données',
        name: 'Nom',
        title: 'Modèle de données {{class}}',
        image: 'Image',
        formatName: 'Caractères autorisés: [ minuscule, -, _ ]',
        model: 'Modèle',
        description: 'Description',
        lines: 'Lignes',
        add: 'Créer un nouveau modèle de données',
        edit: 'Modifier le modèle de données',
        rename: 'Renommer le modèle de données',
        addAttr: 'Attribut',
        infoAttr: 'Modèle de données {{class}} > Attributs',
        info: 'Détail du modèle de données',
        rules: 'Règles de définition de symboles',
        condition: 'Actif selon une condition',
        attrName: 'Attribute à vérifier',
        value: 'Valeur de comparaison',
        operation: 'Opération de comparaison',
        operations: {
          EQUALS: 'est égal',
          GREATER: 'est plus grand',
          GREATER_OR_EQUAL: 'est plus grand ou égal',
          LOWER: 'plus petit',
          LOWER_OR_EQUAL: 'plus petit ou égal',
          CONTAINS: 'contient textuellement'
        },
        createClassModalMessage:
          'Impossible de créer un modèle de données sans attributs. Veuillez en ajouter au moins un en cliquant sur "Ajouter un attribut".',
        createClassConfirmMessage: 'Voulez-vous confirmer la création du modèle de données ?',
        deleteClassConfirmMessage: 'Confirmez-vous la suppression de ce modèle métier ?',
        linkedObjects: 'Objets liés',
        usedElsewhere: "Utilisé par des objets d'autres utilisateurs",
        associations: 'Associations',
        type: 'Type',
        attributes: {
          add: 'Nouvel attribut',
          edit: "Modifier l'attribut",
          info: "Détail de l'attribut",
          delete: "Supprimer l'attribut",
          name: 'Nom attribut',
          description: 'Description',
          field: 'Type',
          category: 'Catégorie',
          multiValued: 'Multi valué'
        },
        category: {
          select: 'Sélectionner une catégorie',
          searchOrCreate: 'Rechercher une catégorie existante OU en créer une nouvelle',
          name: 'Catégorie',
          selectIt: 'Sélectionner la catégorie',
          create: 'Créer la catégorie',
          add: "n'existe pas encore. <br>Il est possible \n de la créer ici. <br>Elle sera automatiquement sélectionnée et ajoutée à la liste des catégories."
        }
      },
      fields: {
        add: 'Créer un nouveau type métier',
        crs: 'CRS (code EPSG) :',
        info: 'Détail du type métier',
        list: 'Types métier',
        edit: 'Modifier le type métier',
        name: 'Nom',
        description: 'description',
        type: 'Type technique',
        attributes: 'Présence dans des attributs',
        attributesTab: 'Attributs',
        attributeName: "Nom d'attribut",
        className: 'Classe',
        confirmFieldDeletion: 'Confirmez-vous la suppression de ce type métier ?',
        fieldType: {
          int: 'Nombre entier',
          long: 'Nombre entier long',
          decimal: 'Nombre décimal',
          string: 'Texte brut',
          keyword: 'Texte indexé',
          instant: 'Date',
          raw: 'Donnée non structurée',
          point: 'Point',
          multipoint: 'Multi-points',
          line: 'Ligne',
          multiline: 'Multi-lignes',
          polygon: 'Polygone',
          multipolygon: 'Multi-polygones',
          information: {
            int: 'Permet de stocker des données numériques entières inférieures à 2^32',
            long: 'Permet de stocker des données numériques entières pouvant dépasser 2^32',
            decimal: 'Permet de stocker des données numériques avec des décimales',
            string:
              "Permet de stocker des données au format alphanumérique. Ces données ne sont pas indexées : il est possible de faire une recherche dessus mais pas d'agrégation",
            keyword:
              'Permet de stocker des données au format alphanumérique. Ces données sont indexées : il est possible de faire une recherche dessus ainsi que des agrégations.',
            instant: 'Permet de stocker une date',
            raw: 'permet de stocker des données de type image ou fichier',
            point:
              "Permet de stocker des coordonnées géographiques d'un objet représenté par un point (format géojson)",
            multipoint:
              "Permet de stocker des coordonnées géographiques d'un objet composé de plusieurs points non reliés (format géojson)",
            line: "Permet de stocker des coordonnées géographiques d'un objet représenté comme une ligne (format géojson)",
            multiline:
              "Permet de stocker des coordonnées géographiques d'un objet représenté avec plusieurs lignes non reliées entre elles (longitude et latitude format géojson)",
            polygon:
              "Permet de stocker des coordonnées géographiques d'un objet représenté par un polygone (format géojson)",
            multipolygon:
              "Permet de stocker des coordonnées géographiques d'un objet représenté par plusieurs polygones imbriqués ou non (format géojson)"
          }
        },
        rawMethods: {
          http: 'Depuis une url',
          upload: 'Téléverser depuis mon ordinateur'
        }
      },
      userInfo: {
        list: 'Utilisateurs',
        info: "Détail de l'utilisateur",
        profile: 'Profil',
        addMetadata: 'Ajouter',
        editMetadata: 'Modifier la métadonnée',
        name: 'Prénom',
        familyName: 'Nom de famille',
        email: 'Adresse mail',
        metadata: 'Métadonnées',
        roles: ' Rôles'
      },
      relationTypes: {
        list: 'Types de relations',
        add: 'Ajouter le type de relation',
        edit: 'Modifier le type de relation',
        info: 'Détail du type de relation',
        name: 'Nom',
        nbRelation: 'Nombre de relations de ce type',
        nbLink: 'Nombre de liens utilisant ce type de relation',
        dateModification: 'Date de modification',
        deletable: 'Peut être supprimé',
        deleteModalMessage: 'Ce type de relation ne peut être supprimé car utilisé.'
      },
      links: {
        list: 'Liens entre attributs',
        add: 'Ajouter un nouveau lien entre attributs',
        classSource: 'Modèle métier source',
        attributeSource: 'Attribut source',
        classDestination: 'Modèle métier de destination',
        attributeDestination: 'Attribut de destination',
        relationType: 'Type de relation',
        selectRelationType: 'Selectionnez un type de relation'
      },
      association: {
        ABAC: 'Règle ABAC',
        LINK: 'Relation',
        NAMED_QUERY: 'Requête nommée',
        WIDGET: 'Restitution',
        DATASET: 'Jeu de données',
        OCLASS: 'Modèle de données',
        DASHBOARD: 'Présentation',
        FIELD: 'Type métier'
      },
      storage: {
        label: 'Base de stockage',
        description: {
          POSTGIS:
            "Ce stockage est conseillé en cas de stockage de données géographique complexes ou dans des systèmes de coordonnées différents de WGS 84. Il est recommandé de ne stocker dans cette base que des modèles métier dont la volumétrie de données estimée n'est pas trop élevée.",
          ELASTIC:
            'Ce stockage est conseillé en cas de forte volumétrie de données prévue pour ce modèle métier. Si vous souhaitez stocker des données géographiques dans ce modèle, des formes simples sont conseillées et le système de coordonnées de référence utilisé doit être WGS 84. Ce système de stockage offre une scalabilité horizontale.'
        },
        options: {
          POSTGIS: 'PostGIS',
          ELASTIC: 'ElasticSearch'
        }
      }
    },
    tooltip: {
      default: 'Tooltip par défaut',
      attribute: 'Tooltip affichant certains attributs',
      cluster: 'Tooltip pour les clusters (graphes)',
      link: 'Tooltip pour les liens (graphes)',
      none: 'Pas de tooltip'
    }
  }
};
