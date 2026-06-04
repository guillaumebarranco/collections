# Configuration PWA pour Makya

Makya est maintenant configuré comme Progressive Web App (PWA). Voici ce qui a été mis en place :

## Fichiers créés

1. **`public/manifest.json`** - Manifest de l'application PWA
2. **`public/sw.js`** - Service Worker pour le cache et le fonctionnement hors ligne
3. **`src/app/services/pwa.service.ts`** - Service pour gérer l'installation et les mises à jour
4. **`src/app/components/pwa-install/pwa-install.component.ts`** - Composant optionnel pour inviter à l'installation

## Fonctionnalités

### ✅ Service Worker
- Cache du shell PWA (`index.html`, JS/CSS/images statiques)
- **Les requêtes `/api/` ne sont pas mises en cache** (données utilisateur = mode hors-ligne dans Préférences uniquement)
- Navigation hors-ligne : affichage de l’app, pas des collections sans mode hors-ligne activé

### ✅ Manifest
- Nom et description de l'application
- Icônes (utilise actuellement logo.png)
- Mode d'affichage standalone
- Couleurs de thème

### ✅ Installation
- Détection automatique de l'installabilité
- Service pour gérer l'installation
- Composant optionnel pour inviter à l'installation

## Utilisation

### Installation automatique
Le service worker s'enregistre automatiquement au chargement de l'application.

### Ajouter le composant d'installation (optionnel)
Si vous souhaitez afficher un banner d'installation, ajoutez le composant dans `app.html` :

```html
<router-outlet></router-outlet>
<app-pwa-install></app-pwa-install>
```

Et importez-le dans `app.ts` :

```typescript
import { PwaInstallComponent } from './components/pwa-install/pwa-install.component';

@Component({
  // ...
  imports: [RouterOutlet, PwaInstallComponent],
})
```

## Génération des icônes PWA

Pour une meilleure expérience, générez des icônes aux bonnes tailles :

### Tailles recommandées
- 192x192 pixels (icône standard)
- 512x512 pixels (icône haute résolution)
- 180x180 pixels (Apple Touch Icon)

### Outils recommandés
1. **PWA Asset Generator** : https://www.pwabuilder.com/imageGenerator
2. **RealFaviconGenerator** : https://realfavicongenerator.net/
3. **Manifest Generator** : https://www.simicart.com/manifest-generator.html/

### Étapes
1. Prenez votre logo.png actuel
2. Utilisez un outil pour générer les différentes tailles
3. Placez les icônes dans le dossier `public/`
4. Mettez à jour `manifest.json` avec les chemins corrects

Exemple de manifest.json avec icônes multiples :
```json
{
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Test de la PWA

### En développement
1. Construisez l'application : `npm run build`
2. Servez les fichiers statiques (le service worker nécessite HTTPS en production)
3. Pour tester en local, utilisez un serveur HTTPS ou `ng serve` avec un proxy

### En production
- Assurez-vous que votre serveur utilise HTTPS (requis pour les PWA)
- Le service worker fonctionnera automatiquement
- Les utilisateurs pourront installer l'application depuis leur navigateur

### Vérification
1. Ouvrez les DevTools (F12)
2. Allez dans l'onglet "Application" (Chrome) ou "Application" (Firefox)
3. Vérifiez :
   - Le manifest est chargé
   - Le service worker est actif
   - Le cache fonctionne

## Personnalisation

### Couleurs du thème
Modifiez dans `manifest.json` :
```json
{
  "theme_color": "#1976d2",  // Couleur de la barre d'adresse
  "background_color": "#ffffff"  // Couleur de fond au démarrage
}
```

### Stratégie de cache
Modifiez `public/sw.js` pour changer la stratégie de mise en cache :
- **Network First** (actuel) : Essaie le réseau d'abord, puis le cache
- **Cache First** : Utilise le cache d'abord, puis le réseau
- **Stale While Revalidate** : Utilise le cache immédiatement, met à jour en arrière-plan

## Notes importantes

1. **HTTPS requis** : Les PWA nécessitent HTTPS en production (sauf localhost)
2. **Service Worker** : Doit être dans la racine ou au même niveau que index.html
3. **Manifest** : Doit être accessible via HTTPS
4. **Mises à jour** : Le service worker se met à jour automatiquement, mais nécessite un rechargement

## Support navigateur

- ✅ Chrome/Edge (Android, Desktop)
- ✅ Firefox (Android, Desktop)
- ✅ Safari (iOS 11.3+, macOS)
- ✅ Samsung Internet

## Prochaines étapes (optionnel)

1. Ajouter des notifications push
2. Implémenter un mode hors ligne plus avancé
3. Ajouter une page de fallback hors ligne
4. Optimiser le cache pour les images
5. Ajouter la synchronisation en arrière-plan
