# ArtSpace

## Description

**ArtSpace** est une plateforme complète de galerie d'art virtuelle permettant aux artistes d'exposer leurs œuvres dans des espaces 3D immersifs. Les visiteurs peuvent explorer des salles d'exposition interactives, découvrir des portfolios d'artistes, participer à des événements culturels, et réserver des billets. La plateforme intègre un système de paiement sécurisé et offre une gestion avancée avec des rôles distincts (Admin, Artiste, Visiteur).

## Fonctionnalités

### Gestion des œuvres d'art
- **Portfolio artiste** : Création et personnalisation de portfolios avec timeline chronologique
- **Galerie 3D interactive** : Visualisation des œuvres dans des salles virtuelles en Three.js
- **Gestion CRUD complète** : Création, modification, suppression d'œuvres (artistes)
- **Système de favoris et likes** : Sauvegarde et réactions sur les œuvres (visiteurs)
- **Commentaires** : Espace d'échange sous chaque œuvre

### Événements et réservations
- **Création d'événements** : Publication d'expositions et vernissages par les artistes
- **Système de billetterie** : Création et gestion de différents types de billets
- **Réservations en ligne** : Sélection de billets, calcul du total, paiement
- **Validation admin** : Approbation/rejet des événements par l'administrateur
- **Statuts de réservation** : Suivi en temps réel (en attente, payée, annulée)
- **Génération de QR codes** : Codes de confirmation pour les billets

### Paiements
- **Intégration Stripe** : Paiements sécurisés pour les réservations
- **Checkout personnalisé** : Tunnel de paiement fluide
- **Historique d'achats** : Consultation des achats passés

### Espaces 3D
- **Salles personnalisables** : Création de rooms thématiques par les artistes
- **Assignation d'œuvres** : Attribution d'œuvres dans des salles spécifiques
- **Visualisation immersive** : Navigation 3D avec React Three Fiber

### Authentification et rôles
- **Inscription/Connexion** : Système d'authentification avec Laravel Sanctum et Passport
- **Gestion multi-rôles** : Admin, Artiste, Visiteur avec permissions spécifiques
- **Profil utilisateur** : Upload d'avatar, modification de profil

### Administration
- **Validation des artistes** : Approbation des nouveaux artistes
- **Modération des événements** : Archivage, restauration, rejet
- **Statistiques globales** : Revenus, réservations, billets vendus
- **Gestion des utilisateurs** : Vue d'ensemble et administration

### Statistiques
- **Dashboard artiste** : Tickets vendus, revenus, top événements
- **Dashboard admin** : Métriques globales de la plateforme
- **Analyses par utilisateur** : Statistiques personnalisées

## Stack technique

### Backend (Laravel 11 + PHP 8.2)
- **Framework** : Laravel 11
- **Authentification** : Laravel Sanctum + Laravel Passport (OAuth2/JWT)
- **Base de données** : SQLite (par défaut, configurable)
- **Paiements** : Stripe PHP SDK
- **QR Codes** : SimpleSoftwareIO QR Code
- **Architecture** : Repository Pattern, Services, Policies
- **Tests** : PHPUnit
- **Code Quality** : Laravel Pint

### Frontend (React 19)
- **Framework** : React 19 + React Router v7
- **Build tool** : Vite (principal) + React Scripts (frontend séparé)
- **Styling** : Tailwind CSS v3/v4
- **3D Graphics** : Three.js + React Three Fiber + React Three Drei
- **Animations** : Framer Motion
- **Post-processing** : React Three Postprocessing
- **Icônes** : Lucide React
- **HTTP Client** : Axios
- **Tests** : React Testing Library + Jest

### DevOps & Outils
- **Développement** : Laravel Sail (Docker), Concurrently
- **Logs** : Laravel Pail
- **UML** : Laravel to UML (diagrammes de classes)

## Installation & Lancement

### Prérequis
- PHP 8.2 ou supérieur
- Composer
- Node.js (v18+ recommandé) & npm
- SQLite (ou MySQL/PostgreSQL si configuré)

### Étapes d'installation

#### 1. Cloner le projet
```bash
git clone <repository-url> ArtSpace
cd ArtSpace
```

#### 2. Installation du backend
```bash
# Installer les dépendances PHP
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Lancer les migrations
php artisan migrate

# Créer les clés Passport (si nécessaire)
php artisan passport:install
```

#### 3. Installation du frontend principal (Vite)
```bash
# Installer les dépendances Node.js
npm install
```

#### 4. Installation du frontend séparé (React App)
```bash
cd artspace-frontend
npm install
cd ..
```

#### 5. Configuration
Modifier le fichier `.env` selon vos besoins :
- **Base de données** : Configurez `DB_CONNECTION`, `DB_HOST`, etc. (SQLite par défaut)
- **Stripe** : Ajoutez vos clés `STRIPE_PUBLIC_KEY` et `STRIPE_SECRET_KEY`
- **URL Frontend** : Configurez `FRONTEND_URL` pour CORS
- **Mail** : Configurez le service d'envoi d'emails si nécessaire

#### 6. Lancer l'application

**Option A : Lancement complet avec Composer (recommandé)**
```bash
composer dev
```
Cette commande lance simultanément :
- Serveur Laravel (http://localhost:8000)
- Queue worker
- Logs en temps réel (Pail)
- Vite dev server

**Option B : Lancement manuel**

Terminal 1 — Backend :
```bash
php artisan serve
```

Terminal 2 — Frontend Vite :
```bash
npm run dev
```

Terminal 3 — Frontend React séparé :
```bash
cd artspace-frontend
npm start
```

### URLs par défaut
- **Backend API** : http://localhost:8000
- **Frontend Vite** : http://localhost:5173
- **Frontend React** : http://localhost:3000

## Structure du projet

```
ArtSpace/
├── app/
│   ├── Http/Controllers/     # Contrôleurs API (Auth, Artist, Artwork, Event, etc.)
│   ├── Models/               # 13 modèles Eloquent (User, Artist, Artwork, Event, etc.)
│   ├── Repositories/         # Couche d'accès aux données
│   ├── Services/             # Logique métier
│   ├── Policies/             # Autorisations
│   ├── Notifications/        # Notifications
│   └── Helpers/              # Fonctions utilitaires
├── database/
│   ├── migrations/           # Migrations de base de données
│   └── seeders/              # Seeders (données de test)
├── routes/
│   ├── api.php               # Routes API (132 lignes, endpoints REST)
│   └── web.php               # Routes web
├── resources/                # Ressources Laravel (views Blade si utilisées)
├── artspace-frontend/        # Application React séparée
│   ├── src/
│   │   ├── components/       # Composants réutilisables (Navbar, Footer, UI, 3D)
│   │   ├── pages/            # Pages (Login, Register, Gallery, Events, etc.)
│   │   ├── routes/           # Configuration React Router
│   │   ├── App.js            # Composant racine
│   │   └── api.js            # Configuration Axios
│   └── public/               # Assets statiques
├── public/                   # Point d'entrée public Laravel
├── config/                   # Fichiers de configuration Laravel
├── tests/                    # Tests PHPUnit
├── composer.json             # Dépendances PHP
├── package.json              # Dépendances Node (Vite)
└── README.md                 # Ce fichier
```

## Modèles de données

Le projet utilise les modèles suivants :
- **User** : Utilisateurs de la plateforme (avec rôles)
- **Artist** : Profils artistes (portfolios, biographie, validation)
- **Artwork** : Œuvres d'art (images, descriptions, styles)
- **Event** : Événements culturels (dates, lieux, statuts)
- **Ticket** : Billets pour événements (prix, quantités)
- **Reservation** : Réservations de billets (statuts, paiements)
- **Room** : Salles d'exposition 3D
- **ArtworkRoom** : Association œuvres ↔ salles
- **Comment** : Commentaires sur les œuvres
- **Style** : Styles artistiques (abstrait, réalisme, etc.)
- **Role** : Rôles utilisateurs (Admin, Artist, Visitor)
- **ArtworkUser** : Favoris/likes utilisateurs
- **ArtistTimeline** : Timeline des événements marquants d'un artiste

## API Routes principales

### Authentification (publique)
- `POST /api/register` : Inscription
- `POST /api/login` : Connexion
- `GET /api/me` : Profil utilisateur (auth)
- `POST /api/logout` : Déconnexion (auth)

### Œuvres d'art
- `GET /api/artworks` : Liste publique des œuvres
- `GET /api/artworks/{id}` : Détails d'une œuvre
- `POST /api/artworks` : Créer une œuvre (artiste)
- `PUT /api/artworks/{id}` : Modifier une œuvre (artiste)
- `DELETE /api/artworks/{id}` : Supprimer une œuvre (artiste)

### Événements
- `GET /api/all-events` : Liste publique des événements
- `GET /api/events/{id}` : Détails d'un événement
- `POST /api/events` : Créer un événement (artiste)
- `PUT /api/events/{id}/approve` : Approuver un événement (admin)
- `PUT /api/events/{id}/reject` : Rejeter un événement (admin)

### Réservations
- `POST /api/reservations` : Créer une réservation (visiteur)
- `GET /api/my-reservations` : Mes réservations (visiteur)
- `PUT /api/reservations/{id}/pay` : Payer une réservation (visiteur)
- `PUT /api/reservations/{id}/cancel` : Annuler une réservation (visiteur)

### Paiements
- `POST /api/checkout/{reservation}` : Initialiser paiement Stripe
- `GET /api/checkout/success` : Callback de succès Stripe

### Statistiques
- `GET /api/stats/events` : Total événements (admin)
- `GET /api/stats/revenue` : Revenus globaux (admin)
- `GET /api/my-stats/tickets` : Mes tickets vendus (artiste)
- `GET /api/my-stats/revenue` : Mes revenus (artiste)

## Améliorations futures

- **Notifications temps réel** : WebSockets avec Laravel Broadcasting pour alertes instantanées
- **Recherche avancée** : Filtres multi-critères (style, artiste, prix, date) avec Laravel Scout
- **Support multilingue** : Internationalisation (i18n) français/anglais
- **Export de données** : PDF/CSV pour artistes et admins
- **Chat en direct** : Messagerie entre visiteurs et artistes
- **API publique** : Endpoints REST documentés avec Swagger/OpenAPI
- **Progressive Web App** : Version PWA pour installation mobile
- **Recommandations IA** : Suggestions d'œuvres basées sur les préférences

---

**Développé avec Laravel 11 + React 19 | 2024-2025**