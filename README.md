# ProvolyDashboard

## Lancement du sample de la lib

Version Node JS 16+

Lancer `npm install` puis `run watch:lib`

Dans une autre fenêtre, lancer `npm start`

## Troubleshooting

Sur Mac, remplacer la ligne dans .npmrc :

//registry.npmjs.org/:\_authToken=${NPM_AUTH_TOKEN}

par

//registry.npmjs.org/:\_authToken=$NPM_TOKEN

## Données générées

Se reporter au README placés dans le répertoire mock-server

## Utilisation de la lib dans un autre projet sans pour autant déployer une version dans le registry

`rm -rf ./dist ./.angular ; npm run build:lib ; cp -rf ./dist/provoly/dashboard ../<projet>/node_modules/@provoly/ ; rm -rf ../<projet>/.angular`

## Utilisation de la lib
Voir dans le README de la lib elle-même

### Lancer les tests d'un module spécifique
`npx jest --coverage --roots projects/provoly/dashboard/<module> --watch`
