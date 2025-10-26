import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'gen-cut2',
  webDir: 'dist/GenCut2',
  plugins: {
    // Configuration pour l'outil de génération d'assets
    assets: {
      // Chemin vers votre image source pour l'icône
      icon: 'assets/icon.png', 
      iconBackgroundColor: '#10B981',
      splashBackgroundColor: '#10B981',
      // Laisser le splash screen vide si vous ne voulez que l'icône pour l'instant
      splashscreen: {
        // ... (si vous voulez un écran de démarrage aussi)
      }
    }
  }
};

export default config;
