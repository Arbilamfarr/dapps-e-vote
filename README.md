# Application de Vote Décentralisée

## Architecture

### Stockage Hybride

1. **Blockchain (Ethereum/Sepolia)**
   - Données critiques et immuables :
     - Votes (mapping des votes par électeur)
     - État de l'élection (ouverte/fermée)
     - Liste des électeurs autorisés (adresses)
     - Comptage des votes par candidat

2. **MongoDB**
   - Données non critiques et métadonnées :
     - Informations détaillées des utilisateurs (nom, email)
     - Profils des candidats (programme, photo)
     - Historique des transactions
     - Logs et statistiques

### Interaction entre Blockchain et MongoDB

1. **Synchronisation**
   - Les événements blockchain déclenchent des mises à jour MongoDB
   - Les transactions sont enregistrées dans MongoDB pour un accès rapide
   - Les métadonnées enrichissent les données blockchain

2. **Flux de données**
   - Vote :
     1. Transaction envoyée à la blockchain
     2. Événement émis par le smart contract
     3. Transaction enregistrée dans MongoDB
     4. Interface mise à jour

## Installation

1. Créer un fichier `.secret` avec votre phrase mnémonique
2. Créer un fichier `.env` avec :
   ```
   VITE_API_URL=http://localhost:3000/api
   MONGODB_URI=mongodb://localhost:27017/voting-dapp
   ```

3. Installer les dépendances :
   ```bash
   npm install
   ```

4. Démarrer MongoDB :
   ```bash
   mongod
   ```

5. Déployer le smart contract :
   ```bash
   truffle migrate --network sepolia
   ```

6. Démarrer le serveur :
   ```bash
   npm run dev
   ```

## Fonctionnalités

### Admin
- Déploiement du contrat
- Gestion des électeurs
- Contrôle de l'élection
- Suivi des résultats

### Électeurs
- Authentification MetaMask
- Vote sécurisé
- Historique des transactions

## Sécurité

- Authentification via MetaMask
- Vérification des électeurs sur la blockchain
- Données sensibles stockées uniquement sur la blockchain
- Transactions signées et vérifiables