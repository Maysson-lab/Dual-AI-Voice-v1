# Voix Dual IA / Groupe d'Agents Vocaux Actionnables - Roadmap

Ce document décrit l'état actuel, les fonctionnalités à venir et la vision à long terme pour faire évoluer l'application vers un **Groupe d'Agents Vocaux Actionnables**.

## Phase 1 : Fondation (État Actuel)
- [x] Architecture Full-stack (React/Vite, Node.js/Express).
- [x] Communication temps réel via Socket.io.
- [x] Intégration de l'API Gemini avec streaming de tokens.
- [x] Synthèse vocale in-browser (Web Speech API) avec voix françaises.
- [x] Interface utilisateur moderne (Glassmorphism, Tailwind).
- [x] Multiples profils d'IA (Débat, Podcast, Philosophie, Clash).
- [x] Interventions de l'utilisateur en temps réel.
- [x] Limite de tours configurable.

## Phase 2 : Agents Actionnables & Appels de Fonctions (Court terme)
- [ ] **Function Calling (Appel d'outils)** : Intégrer la capacité pour les agents Gemini d'utiliser des outils (recherche web, lecture d'API, etc.).
- [ ] **Agent Superviseur / Chef d'Orchestre** : Créer un agent "Manager" qui reçoit la requête vocale de l'utilisateur et délègue les tâches aux sous-agents compétents.
- [ ] **Capacités Opérationnelles** : Ajouter des plugins pour des actions concrètes (gestion de calendrier, envoi d'emails, contrôle domotique).
- [ ] **Partage de Contexte d'Action** : Un tableau de bord visuel où les agents affichent les recherches, les données récupérées et le statut des actions en cours.

## Phase 3 : Interaction Vocale Avancée & Multimodale (Moyen terme)
- [ ] **Speech-to-Text (Reconnaissance Vocale)** : Permettre à l'utilisateur de parler au groupe d'agents au lieu de taper ses interventions, en utilisant l'API Web Speech ou un service Cloud.
- [ ] **Gemini Live API (WebRTC)** : Remplacer l'approche textuelle générative actuelle par l'API Gemini Live pour une latence ultra-faible, des interruptions vocales fluides et une compréhension de l'intonation.
- [ ] **TTS Cloud Premium** : Remplacer la synthèse du navigateur par des voix cloud neuronales ultra-réalistes (Google Cloud TTS ou ElevenLabs) spécifiques à chaque rôle d'agent.
- [ ] **Compréhension Visuelle** : Ajouter la possibilité pour l'utilisateur de partager son écran ou sa caméra avec les agents pour des tâches de diagnostic ou d'assistance visuelle.

## Phase 4 : Persistance, Mémoire & Écosystème (Long terme)
- [ ] **Base de Connaissances Vectorielle** : Intégrer une base de données vectorielle (ex: Pinecone, Qdrant) ou Firestore pour offrir aux agents une mémoire à long terme de l'utilisateur.
- [ ] **Créateur d'Équipe d'Agents** : Interface permettant aux utilisateurs de créer leur propre "équipe de département", de définir des profils de compétences spécialisées et de les assigner à des tâches autonomes récurrentes.
- [ ] **Mode "Swarm" Autonome** : Permettre au groupe d'agents de travailler de manière asynchrone sur une tâche longue sans interface ouverte, avec un rapport vocal généré une fois terminé.
- [ ] **Intégration d'Outils Externes (OAuth)** : Connexion sécurisée aux outils de l'espace de travail (Google Workspace, Slack, GitHub) pour une automatisation complète.
