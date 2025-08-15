☕ Coffee Counter – Suivi de Café
📌 Description

Coffee Counter est une application web développée avec Laravel (backend API) et React (frontend) permettant de suivre de manière ludique et automatisée qui « doit » un café à qui, après une partie de jeu.
Le but est d’offrir un suivi simple, rapide et visuellement agréable pour résoudre (ou envenimer 😏) les dettes de cafés entre amis ou collègues.

🚀 Fonctionnalités principales

Gestion des parties

Enregistrement d’une partie avec deux types de perdants :

Perdant aux dégâts

Perdant au concept spécial « Aram Café »

Attribution automatique des dettes de café en fonction des résultats.

Historique complet des parties pour suivre l’évolution des dettes.

Tableau récapitulatif indiquant qui doit combien à qui.

API RESTful pour interaction avec le frontend.

Base de données relationnelle gérée avec Eloquent ORM.

Déploiement conteneurisé avec Docker et orchestré avec Traefik.

🛠️ Stack technique
Backend

Laravel 12 – API REST

PHP 8.x

Eloquent ORM – gestion des modèles et relations

MySQL / MariaDB – base de données relationnelle

Docker – conteneurisation

Traefik – reverse proxy et gestion HTTPS

Frontend

React – interface utilisateur

TailwindCSS – design rapide et responsive

Axios – communication avec l’API

📂 Structure du projet
/backend       → Code source Laravel (API)
/frontend      → Code source React
/docker        → Fichiers de configuration Docker et Traefik

⚙️ Installation et exécution

Cloner le dépôt

git clone https://github.com/ThomasPIET/coffee_counter.git
cd coffee_counter


Configurer l’environnement

Copier les fichiers .env.example vers .env dans /backend et /frontend.

Adapter les paramètres de connexion à la base de données.

Lancer avec Docker

docker-compose up -d


Accéder à l’application

API Laravel : http://localhost/api

Frontend React : http://localhost

📊 Base de données

Tables principales :

users – joueurs

games – parties enregistrées

debts – dettes de cafés

Relations clés :

Un joueur peut participer à plusieurs parties.

Les dettes sont calculées et stockées automatiquement après chaque partie.

🔮 Évolutions prévues

Ajout d’un système d’authentification et gestion des profils utilisateurs.

Statistiques avancées sur les dettes et performances de jeu.

Export des données en CSV / PDF.

Notifications en temps réel lors de l’enregistrement d’une partie.

👤 Auteur

Thomas Piet – Développeur Full Stack
