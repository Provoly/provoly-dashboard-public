export const frTranslations = {
  '@pry': {
    search: {
      title: 'Recherche',
      button: {
        update: 'Enregistrer',
        search: 'Rechercher',
        cancel: 'Annuler',
        reset: 'Remise à zéro',
        backSearch: 'Retour à la liste des recherches',
        mono: 'Recherche par classe',
        multi: 'Recherche par champs métier'
      },
      home: {
        or: 'ou',
        title: 'Mes recherches',
        ssTitle: 'Nouvelle recherche',
        searchByCriteria: 'Recherche par critères',
        associatedWidget: 'le widget associé à cette recherche',
        showAssociatedWidget: 'Afficher le widget associé à cette recherche',
        otherActions: 'Autres actions'
      },
      attribute: {
        title: 'Attribut : ',
        remove: 'Retirer le filtre'
      },
      type: {
        and: 'ET',
        or: 'OU'
      },
      composed: {
        class: 'Classe',
        title: 'Incluez des filtres',
        order: 'Ajouter un tri',
        orderA: 'Croissant',
        orderD: 'Décroissant',
        orderNone: 'Aucun tri',
        shouldSelectClass: 'Choisissez une classe',
        changeClassWarning: 'Changer de classe supprimera toutes les conditions',
        addCondition: 'Ajouter une condition',
        addGroup: 'Ajouter un sous-groupe',
        removeGroup: 'Supprimer un sous-groupe'
      },
      operator: {
        contains: 'Contient (sensible à la casse)',
        containsCaseInsensitive: 'Contient (pas sensible à la casse)',
        startWith: 'Commence par',
        endWith: 'Fini par',
        notEqualsString: 'Différent de',
        notEqualsNumber: 'Différent de',
        equalsString: 'Exactement',
        equalsNumber: 'Egal',
        greaterThanNumber: 'Supérieur à',
        lowerThanNumber: 'Inférieur à',
        innerBoundsNumber: 'Compris entre',
        outerBoundsNumber: "A l'extérieur de",
        greaterThanDate: 'Après',
        lowerThanDate: 'Avant',
        innerBoundsDate: 'Entre deux dates',
        outerBoundsDate: "A l'extérieur d'une période",
        in: 'Appartient à',
        not_in: "N'appartient pas à"
      },
      placeholder: {
        search: 'Entrer la valeur ...',
        minValue: 'Valeur min ...',
        maxValue: 'Valeur max ...'
      },
      namedQuery: {
        emptyNamedQuery: 'Aucune recherche enregistrée',
        open: 'Enregistrer la recherche sous...',
        title: 'Nommez cette recherche',
        saveTitle: 'Sauvegarder cette recherche',
        renameTitle: 'Renommer cette recherche',
        rename: 'Renommer',
        name: 'Nom',
        description: 'Description',
        favorite: 'Epingler',
        noFavorite: 'Détacher',
        display: 'Afficher',
        refreshData: 'Actualiser',
        noSpot: 'Recherche non utilisée',
        color: 'Couleur jeu de données',
        spot: 'Repérer',
        spotTitle: 'La recherche est utilisée à {{length}} endroits:',
        use: 'Vue n°{{windowIndex}}',
        delete: 'Supprimer',
        edit: 'Editer',
        seeLess: 'voir moins',
        seeMore: 'voir plus',
        explore: 'Recherche exploratoire',
        type: {
          map: 'Carte',
          table: 'Tableau',
          chart: 'Graphique',
          graph: 'Relations'
        },
        alreadyEditing: 'Vous avez déjà une édition de recherche en cours.',
        refresh: {
          title: 'Rafraichissement automatique',
          0: 'Inactif',
          10: '10 secondes',
          30: '30 secondes',
          60: '1 minute'
        }
      },
      mono: {
        title: 'Recherche critères avancés'
      },
      fulltext: {
        allClasses: 'Toutes les classes',
        oneClass: 'Une classe sélectionnée',
        manyClasses: '{{nb}} classes sélectionnées',
        selectClass: 'Sélectionner la classe',
        search: 'Lancer la recherche',
        clear: 'Effacer la saisie'
      },
      multi: {
        title: 'Ajouter des critères',
        addCondition: 'Ajouter un critère',
        options: 'Options',
        extraOptions: 'Options supplémentaires',
        multiType: 'Associer les critères',
        search: 'Rechercher',
        requiredError: 'La valeur est manquante',
        patternError: 'Le format est incorrect',
        selectField: 'Sélectionner un critère',
        legend: 'Critère / classes utilisant ce critère',
        in: 'dans'
      },
      params: {
        title: 'Paramètres de recherche',
        button: 'Enregistrer les paramètres',
        namedQuery: {
          title: 'Recherches',
          description:
            "Cette partie regroupe les paramètres par défaut d'une nouvelle recherche(la couleur à utiliser, ...)"
        }
      }
    }
  }
};
