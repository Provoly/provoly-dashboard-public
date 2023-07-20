export const frTranslations = {
  '@pry': {
    pipeline: {
      codes: {
        LOOP_IN_TASK:
          "Une boucle est présente dans le modèle des tâches, en utilisant les noeuds d'id suivants: {{ids}}",
        MISSING_NODE: "Un lien pointe vers un noeud qui n'existe pas : {{value}}",
        DUPLICATE_NODE: "Le noeud d'id {{id}} est présent deux fois dans le modèle envoyé",
        NO_INPUT: "Une entrée de noeud n'est pas liée alors que c'est nécessaire",
        NO_INPUT_MODEL: "Le noeud précédent dans le graphe n'a pas généré son modèle",
        GRAPH_CANNOT_BE_PARSED: "Le graphe serialisé n'a pas pu être lu par le serveur",
        GENERIC_ERROR: 'Problème de validation du serveur ({{error}})',
        MISSING_PROPERTY: 'La propriété {{propertyName}} est obligatoire',
        BAD_ATTRIBUTE_TYPE: "L'attribut {{attributeName}} a un type incorrect.",
        DATASET_CONFLICT:
          'Les jeux de données suivants ({{datasetDefIds}}) sont en entrée et en sortie de la transformation'
      },
      activateError: "Erreur lors de l'activation",
      deactivateError: 'Erreur lors de la désactivation',
      editor: 'Accéder au processus',
      errors: 'Erreurs',
      global: 'Global',
      node: 'Noeud',
      consult: 'Consulter',
      execute: 'Exécuter',
      execution_date: 'Date exécution',
      version: 'Version',
      execution: 'Status exécution',
      title: 'Titre du composant',
      activity: 'Activité',
      action: 'Action',
      transformation_catalog: 'Catalogue des transformations',
      activate: 'Activer',
      activated: 'Activée',
      deactivate: 'Désactiver',
      deactivated: 'Désactivée',
      backToDescription: 'Retour à la description',
      selectedTask: 'Tâche sélectionnée',
      type: 'Type',
      ok: 'OK',
      ko: 'KO',
      create: 'Créer une transformation',
      save: 'Enregistrer',
      cancel: 'Annuler',
      goBack: 'Retour au catalogue',
      details: {
        consult: 'Consultation',
        transformation: 'Transformation',
        detail: 'Détail',
        title: 'Titre',
        description: 'Description',
        version: 'Version',
        creation_date: 'Date de création',
        state: 'Etat',
        execution: 'Exécution',
        execution_status: 'Status exécution',
        execution_date: 'Date exécution',
        last_execution_date: 'Date de la dernière exécution',
        required: 'Le champs est requis',
        maxLength: 'Nombre de caractères autorisé : {{len}}'
      },
      input: 'Sources de données entrantes',
      operation: 'Liste des opérations',
      output: 'Jeux de données sortants',
      delete: 'Supprimer le composant',
      down: 'Afficher le contenu du sous-graphe',
      up: 'Sortir du sous-graphe',
      status: {
        terminated: 'Terminé',
        started: 'En cours',
        error: 'Erreur'
      }
    }
  }
};
