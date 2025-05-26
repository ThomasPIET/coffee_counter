# Déploiement Coffee Counter avec Traefik

## Configuration requise sur le VPS

### 1. Prérequis
- Docker et Docker Compose installés
- Nom de domaine pointant vers votre VPS
- Port 80 et 443 ouverts

### 2. Installation

```bash
# Cloner le projet
git clone <votre-repo>
cd coffee_counter_react

# Copier et configurer l'environnement
cp .env.example .env
nano .env
```

### 3. Configuration .env

Modifiez les variables suivantes dans `.env` :

```env
# Votre domaine
DOMAIN=coffee.votre-domaine.com

# Email pour Let's Encrypt
ACME_EMAIL=votre-email@example.com

# Générer une clé d'application
APP_KEY=base64:VOTRE_CLE_GENEREE
```

### 4. Générer la clé d'application

```bash
# Option 1: Avec Laravel installé localement
php artisan key:generate --show

# Option 2: Avec Docker
docker run --rm -v $(pwd):/app composer:latest sh -c "cd /app && composer install --no-dev && php artisan key:generate --show"
```

### 5. Déploiement

```bash
# Lancer le script de déploiement
./deploy.sh
```

## Structure des services

- **Traefik** : Reverse proxy avec SSL automatique
- **Coffee Counter** : Application Laravel/React

## Accès aux services

- Application : `https://votre-domaine.com`
- Dashboard Traefik : `https://traefik.votre-domaine.com`

## Commandes utiles

```bash
# Voir les logs
docker-compose logs -f

# Redémarrer l'application
docker-compose restart coffee-counter

# Mettre à jour
git pull
docker-compose build --no-cache
docker-compose up -d

# Accéder au container
docker-compose exec coffee-counter sh

# Exécuter des commandes Laravel
docker-compose exec coffee-counter php artisan migrate
docker-compose exec coffee-counter php artisan cache:clear
```

## Sauvegardes

La base de données SQLite est dans `./database/database.sqlite`. Pensez à sauvegarder ce fichier régulièrement.

## Dépannage

### Erreur de permissions
```bash
sudo chown -R $USER:$USER .
chmod -R 755 storage bootstrap/cache
```

### Problème SSL
Vérifiez que votre domaine pointe bien vers le VPS et que les ports 80/443 sont ouverts.

### Logs Traefik
```bash
docker-compose logs traefik
```