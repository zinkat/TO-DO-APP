
# 📝 To-Do App – Gestionnaire de tâches React + Firebase

Bienvenue sur mon application de gestion de tâches construite avec **React**, **Tailwind CSS** et **Firebase** (authentification + base de données Firestore).  
Elle est entièrement responsive et déployée en production via Vercel.

---

## 🚀 Fonctionnalités

- ✅ Authentification sécurisée (email + mot de passe)
- ✅ Ajout, édition et suppression de tâches
- ✅ Filtrage par priorité, tag et état (fait / à faire)
- ✅ Tri dynamique (date ou priorité)
- ✅ Recherche en temps réel
- ✅ Interface responsive (mobile friendly)
- ✅ Mode sombre (dark mode)
- ✅ Notifications (toasts) avec feedback utilisateur
- ✅ Stockage en base de données Firebase Firestore

---

## 🔧 Stack utilisée

- ⚛️ **React 19**
- 🎨 **Tailwind CSS**
- 🔥 **Firebase** (Auth + Firestore)
- 🚦 **React Router DOM**
- 🍞 **React Hot Toast** (notifications)
- ☁️ **Vercel** pour le déploiement

---

## 🔐 Authentification

- Création de compte via **Firebase Auth**
- Connexion sécurisée
- Gestion automatique de la session utilisateur
- Données personnelles (tâches) liées à l'email

---

## 📦 Installation en local (mode dev)

> ⚠️ Le projet utilise des variables d’environnement pour Firebase. Crée un fichier `.env.local`.

### 1. Clone le projet

```bash
git clone https://github.com/zinkat/TO-DO-APP.git
cd TO-DO-APP
```

### 2. Installe les dépendances

```bash
npm install
```

### 3. Crée un fichier `.env.local` et ajoute tes clés Firebase

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 4. Lance le projet

```bash
npm run dev
```

---

## 🌍 Déploiement

Le projet est déployé gratuitement via [**Vercel**](https://vercel.com/).  
Lien du projet en ligne : 👉 https://to-do-app-jiq5.vercel.app/

---

## 🧱 Architecture

- `src/pages/` → pages principales (Login, Register, Home)
- `src/components/` → composants réutilisables (Formulaire, Tâche, Filtres, Pagination)
- `src/api/` → appels Firebase (CRUD tâches, auth)
- `src/auth/` → gestion du contexte utilisateur

---

## ✅ Améliorations futures

- 📆 Ajout d’un calendrier ou vue agenda
- 🔄 Synchronisation multi-appareils en temps réel
- 📱 Ajout d’une PWA (Progressive Web App)
- 💬 Ajout de sous-tâches ou commentaires
- 🔒 Gestion des rôles (admin / utilisateur)

---

## 🙋‍♀️ À propos

Ce projet fait partie de mon portfolio personnel.  
Je suis **développeuse front-end React junior** à la recherche de nouvelles opportunités.

💼 [LinkedIn – Zineb Katim](https://www.linkedin.com/in/zineb-katim/)  
📂 [Mes autres projets sur GitHub](https://github.com/zinkat)

---

## 🧠 Leçons apprises

- Maîtrise de Firebase (Auth + Firestore)
- Gestion d'état globale via `useContext`
- Connexion/déconnexion sécurisée
- Intégration continue (Vercel)
- Organisation modulaire d’un projet React pro
