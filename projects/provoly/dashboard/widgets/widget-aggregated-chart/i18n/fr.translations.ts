export const frTranslations = {
  '@pry': {
    widget: {
      chart: {
        numberLocale: {
          decimal: ',',
          thousands: ' ',
          grouping: [3],
          currency: ['€', '']
        },
        timeFormatLocale: {
          dateTime: '%Y %B %d %H:%M:%S',
          date: '%d/%m/%Y',
          time: '%H:%M:%S',
          periods: ['AM', 'PM'],
          days: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
          shortDays: ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'],
          months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
          shortMonths: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        },
        specializedLocale: {
          default: '%Y-%m-%dT%H:%M:%S',
          DATETIME: '%Y/%m/%d %H:%M:%S',
          DATE: '%d/%m/%Y',
          MONTH_YEAR: '%m/%Y',
          DAY_MONTH: '%d/%m',
          YEAR: '%Y',
          MONTH: '%m',
          DAY: '%d',
          interval: {
            default: '%Y-%m-%dT%H:%M:%S',
            second: '%Y/%m/%d %H:%M:%S',
            minute: '%Y/%m/%d %H:%M',
            hour: '%Y/%m/%d %H:00',
            day: '%Y-%m-%d',
            month: '%Y-%m',
            year: '%Y'
          }
        },
        operation: {
          none: "Valeur de l'attribut",
          count: 'Nombre',
          sum: 'Somme',
          cardinality: "Nombre d'éléments distincts",
          avg: 'Moyenne',
          median: 'Médiane',
          q1: 'Quartile inférieur',
          q3: 'Quartile supérieur',
          min: 'Minimum',
          max: 'Maximum',
          percent: 'Pourcentage',
          title: 'Opération'
        },
        chooseParameters: "Merci de sélectionner les paramètres afin d'afficher le graphique",
        type: 'Type de graphique',
        title: 'Titre du graphique',
        graphType: {
          'area-default': 'Aire',
          'area-with-lines-and-points': 'Aire avec lignes et marques',
          'bar-default': 'Barres',
          'arc-default': 'Circulaire',
          'line-default': 'Courbe',
          'line-with-points': 'Courbe avec marques',
          'arc-donut': 'Diagramme anneau',
          'bar-histogram': 'Histogramme',
          'point-default': 'Points'
        },
        donutSize: "Diamètre intérieur de l'anneau",
        abscissa: 'Abscisse',
        ordinate: 'Ordonnée',
        dataLabel: 'Libellé de la donnée',
        origin: 'Axe contenant 0',
        limit: "Limiter le nombre d'éléments affichés en abscisses",
        limitMaxNb: "Nombre d'élements maximum",
        interval: 'Intervalle des données',
        timeInterval: 'Intervalle de temps',
        specifyInterval: "Spécifier le pas de l'intevalle",
        groupBy: 'Regroupement',
        groupAttr: 'Attribut de regroupement',
        colorScheme: 'Schéma de couleur',
        legend: 'Afficher la légende',
        legendLabel: 'Légende',
        tooltip: 'Affichage des info-bulles',
        stacked: 'Superposition verticale',
        noData: 'Aucune datasource sélectionnée',
        aggNoResult: 'Aucune donnée à afficher',
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
        time: {
          second: 'Seconde',
          minute: 'Minute',
          hour: 'Heure',
          day: 'Jour',
          week: 'Semaine',
          month: 'Mois',
          quarter: 'Trimestre',
          year: 'Année'
        },
        color: 'Couleur',
        sort: {
          title: 'Tri',
          attribute: 'Attribut',
          direction: 'Direction',
          asc: {
            quantitative: 'Croissant',
            ordinal: 'Alphabétique',
            nominal: 'Alphabétique',
            temporal: 'Chronologique'
          },
          desc: {
            quantitative: 'Décroissant',
            ordinal: 'Anti-alphabétique',
            nominal: 'Anti-alphabétique',
            temporal: 'Antéchronologique'
          },
          by: {
            operation: {
              none: 'Ordonnée',
              count: "Nombre d'occurences",
              cardinality: "Nombre d'occurences uniques"
            }
          }
        }
      }
    },
    message: {
      'backend-only-1-datasource':
        'Le service aggregation ne peut prendre en compte que la première datasource associée au widget.',
      'cannot-aggregate-virtual-ds':
        'Le service aggregation ne peut pas agréger sur des dataset virtuels tels que la recherche courante.'
    }
  }
};
