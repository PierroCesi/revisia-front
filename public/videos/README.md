# Vidéos de démonstration

## Comment ajouter votre vidéo de démonstration

1. **Placez votre fichier vidéo** dans ce dossier (`/public/videos/`)
2. **Nommez-la** `demo.mp4` (ou modifiez le chemin dans `src/app/page.tsx` ligne 380)
3. **Formats supportés** : MP4, WebM, MOV
4. **Taille recommandée** : 
   - Résolution : 1920x1080 (Full HD) ou 1280x720 (HD)
   - Durée : 30-60 secondes pour une démo efficace
   - Taille de fichier : < 50MB pour un chargement optimal

## Optimisation pour le web

Pour de meilleures performances, nous recommandons :

- **Compression** : Utilisez un outil comme HandBrake ou FFmpeg
- **Codec** : H.264 pour une compatibilité maximale
- **Bitrate** : 2-5 Mbps selon la qualité souhaitée

## Exemple de commande FFmpeg pour optimiser :

```bash
ffmpeg -i votre_video.mp4 -c:v libx264 -crf 23 -c:a aac -b:a 128k -movflags +faststart demo.mp4
```

## Fonctionnalités du lecteur vidéo

- ✅ **Autoplay** : Se lance automatiquement (en mode muet)
- ✅ **Responsive** : S'adapte à toutes les tailles d'écran
- ✅ **Contrôles** : Play/pause, volume, plein écran
- ✅ **Loop** : Se répète automatiquement
- ✅ **Interface moderne** : Contrôles overlay avec effet de flou

## Personnalisation

Pour modifier les paramètres de la vidéo, éditez le composant `VideoPlayer` dans `/src/components/VideoPlayer.tsx` ou les props dans `/src/app/page.tsx`.
