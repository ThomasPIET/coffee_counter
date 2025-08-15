# ☕ Coffee Counter – Application de suivi de cafés

## 📌 Présentation du projet

**Coffee Counter** est une application web full-stack développée en **Laravel** (API REST) et **React** (frontend), destinée à automatiser le suivi de “dettes de café” entre joueurs après des parties de jeu.  
Le projet a été conçu et réalisé **en autonomie complète**, de la définition des besoins jusqu’au déploiement en production, dans un environnement proche des conditions réelles d’entreprise.

---

## 🎯 Objectifs pédagogiques et professionnels

Ce projet m’a permis de :
- **Analyser un besoin utilisateur** et le formaliser en règles métier claires.
- **Concevoir et développer une application full-stack** avec API REST, base de données relationnelle et interface responsive.
- **Mettre en œuvre une architecture conteneurisée** avec déploiement automatisé sur VPS.
- **Appliquer de bonnes pratiques** de versionnement (Git) et d’organisation de code.

---

## 🛠️ Stack technique

- **Backend** : Laravel 12, PHP 8.x, Eloquent ORM, MySQL/MariaDB  
- **Frontend** : React, TailwindCSS, Axios  
- **Déploiement** : Docker, Traefik (reverse proxy + HTTPS), Watchtower (mises à jour)  
- **Gestion de code** : Git + GitHub  

---

## ⚙️ Fonctionnalités clés

- Enregistrement des parties avec :
  - Perdant aux dégâts (1 café par adversaire)
  - Perdant au concept (X cafés par adversaire)
  - Application d’une règle spéciale en cas de double défaite
- Calcul automatique et mise à jour des dettes
- Consultation de l’historique complet des parties
- Interface responsive utilisable sur mobile et desktop
- API REST pour communication avec le frontend

---

## 📂 Organisation et méthodologie

- Travail en **itérations courtes** (MVP → améliorations successives)
- **Versionnement Git** avec commits explicites
- Gestion simple des tâches via notes personnelles et priorisation par fonctionnalités
- Documentation technique minimale (installation, lancement, règles métier)

---

## 🔮 Perspectives

- Ajout de rôles utilisateurs
- Module de statistiques avancées
- Export des données (CSV/PDF)
- Notifications en temps réel

---
