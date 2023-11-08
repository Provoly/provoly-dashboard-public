export const frTranslations = {
  '@pry': {
    widget: {
      chart: {
        title: 'Titre du graphique',
        tooltip: 'Affichage des info-bulles',
        params: {
          noParams: 'Aucune donnée pour le graphique avec les paramètres sélectionnés',
          multipleParams: 'Nombre de données avec les paramètres sélectionnés: '
        },
        encoding: {
          horizontal: 'Axe horizontal',
          vertical: 'Axe vertical',
          group: 'Type de calcul',
          values: 'Valeurs'
        },
        markType: {
          null: '',
          bar: 'Barres',
          line: 'Courbe',
          point: 'Points',
          area: 'Aire',
          arc: 'Circulaire',
          radar: 'Radar',
          circle_pack: 'Paquets de cercles',
          histogram: 'Histogramme',
          timehistogram: 'Histogramme de temps',
          grouped: 'Histogramme empilé',
          histostacked: 'Histogramme groupé',
          withPoints: 'Courbe avec marques',
          multi: 'Courbes empilées',
          scatterColor: 'Nuages de points avec couleurs',
          withLinesAndPoints: 'Aire avec lignes et marques',
          areastacked: 'Aires empilées',
          pie: 'Diagramme circulaire',
          donut: 'Diagramme anneau'
        },
        scheme: {
          accent: '8 couleurs n°1',
          set2: '8 couleurs n°2',
          dark2: '8 couleurs sombre',
          pastel2: '8 couleurs pastel',
          set1: '9 couleurs',
          pastel1: '9 couleurs pastel',
          category10: '10 couleurs',
          tableau10: '10 couleurs différentes',
          set3: '12 couleurs',
          paired: '12 couleurs différentes',
          tableau20: '20 couleurs',
          category20: '20 couleurs avec 2 nuances',
          category20b: '20 couleurs avec 4 nuances n°1',
          category20c: '20 couleurs avec 4 nuances n°2',
          'KO/W/OK': 'Feu de signalisation',
          Provoly: 'Provoly'
        },
        dataLabel: 'Libellé de la donnée',
        origin: 'Axe affichant la valeur zéro',
        series: 'Regrouper en séries',
        seriesAttr: 'Attribut de regroupement',
        seriesScheme: 'Jeu de couleur',
        seriesSchemeAlt: 'https://vega.github.io/vega/docs/schemes/',
        seriesLegend: 'Afficher la légende',
        chooseParameters: "Merci de sélectionner les paramètres afin d'afficher le graphique",
        timeUnit: 'Unité de temps',
        timeUnitList: {
          year: 'Année',
          quarter: 'Trimestre',
          month: 'Mois',
          week: 'Semaine',
          day: 'Jour',
          hours: 'Heures',
          minutes: 'Minutes'
        },
        type: 'Type de graphique',
        template: 'Modèle de graphique',
        aggregation: {
          none: 'Valeur',
          count: 'Nombre',
          sum: 'Somme',
          distinct: "Nombre d'éléments distincts",
          average: 'Moyenne',
          median: 'Médiane',
          q1: 'Quartile inférieur',
          q3: 'Quartile supérieur',
          min: 'Minimum',
          max: 'Maximum'
        },
        comparison: {
          item: "Comparaison d'objets",
          value: 'Liste de valeurs',
          key: 'Propriété contenant la branche',
          values: 'Propriété contenant la valeur',
          category: "Propriété contenant l'objet"
        },
        radar: {
          titleItem: 'Comparaisons affichant {{props}}',
          titleList: 'Branches {{key}}, affichant {{value}}, regroupées par {{category}}',
          defineKey: '«Clé»',
          defineValue: '«Valeur»',
          defineCategory: '«Catégorie»'
        },
        circle: {
          id: "Champ identifiant l'item",
          pid: 'Champ identifiant le parent',
          field: 'Champ identifiant la valeur',
          title: 'Paquets de cercles présentant {{field}}',
          tooltip: 'Champ à afficher dans le tooltip'
        },
        innerRadius: 'Taille du rayon interne',
        moreOptions: 'Mode avancé'
      }
    }
  }
};
