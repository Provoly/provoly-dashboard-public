# ProvolyDashboard

## Lancement du sample de la lib

Version Node JS 18.18.2

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

## Publication d'une nouvelle version
1. Sur la [page du dépôt](https://github.com/Provoly/provoly-dashboard) cliquer sur le bouton 'Releases'
2. Cliquer sur le bouton 'Draft a new release'
3. Cliquer sur la liste déroulante 'Choose a tag' et créer le tag avec le numéro de version correspondante.
4. Mettre le numéro de version dans le titre (facultatif, si on ne le fait pas ça se fait automatiquement).
5. Cliquer sur 'Publish release'.

----------

> Si c'est une release mineure ou majeure, la change log de la version doit être générée. Le script pour génerer la change log se trouve dans le dépôt `release-note-producer` coté GitLab. Les instructions de l'utilisation sont dans le README du dépôt.

> Après avoir generé la release note, il faut la copier dans le dépôt `provoly-doc`, dans le fichier `docs/modules/livraison/pages/change_log.adoc`, sous un header du sprint correspondant.
