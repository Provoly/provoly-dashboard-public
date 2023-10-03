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

## Publication d'une nouvelle version
1. Sur la [page du dépôt](https://github.com/Provoly/provoly-dashboard) cliquer sur le bouton 'Releases'
2. Cliquer sur le bouton 'Draft a new release'
3. Cliquer sur la liste déroulante 'Choose a tag' et créer le tag avec le numéro de version correspondante.
4. Mettre le numéro de version dans le titre (facultatif, si on ne le fait pas ça se fait automatiquement).
5. Cliquer sur 'Publish release'.

----------
Si c'est une release mineure (0.x), la release note de la version doit être générée. Pour cela, il faut :
1. Cloner le dépôt `release-note-producer`.
2. Se déplacer dans le dossier du dépôt.
3. Passer la commande `node release.js <projectId> <milestone> <token>`, ou :
  * projectId - pour le front c'est 3594, on peut le retrouver sur la page du dépôt sur GitLab
  * milestone - le nom du milestone GitLab correspondant au nom du sprint
  * token - GitLab access token avec le droit 'read_api'

#### Exemple d'utilisation
> `node release.js 3594 'Sprint 13' <token>`
4. Ensuite copier la release note générée dans le dépôt `yap-doc`, dans le fichier `modules/ROOT/pages/release_note.adoc`, sous un header du sprint correspondant.
