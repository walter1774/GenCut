import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
//? ************************************************************************************************************
//? *************** commandes en lignes pour mettre l'appli sur le téléphone ***********************************
//? ************************************************************************************************************

//? 🔜 1.Installe les dépendances Capacitor nécessaires.
//? npm install @capacitor/core @capacitor/cli @capacitor/android	
//? 🔜 2.Initialise Capacitor et crée le fichier capacitor.config.json à la racine, avec le bon chemin de build.
//? npx cap init --web-dir dist/GenCut2	

//? ******************************************************************
//? exemple du fichier capacitor.config.ts
//? import type { CapacitorConfig } from '@capacitor/cli';

//? const config: CapacitorConfig = {
//?   appId: 'com.example.app',
//?   appName: 'gen-cut2',
//?   webDir: 'dist/GenCut2'
//? };

//? export default config;
//? ******************************************************************

//? 🔜 3.Crée le dossier natif android.
//? npx cap add android	
//? 🔜 4.Entrez dans le dossier Android.
//? cd .\android	
//? 🔜 5.Crée le fichier local.properties avec le chemin exact de votre SDK Android, pour que Gradle puisse compiler.
//? "sdk.dir=C:\\Users\\User-TERRA\\AppData\\Local\\Android\\Sdk" | Out-File .\local.properties -Encoding ASCII	
//? 🔜 6.Retournez au répertoire racine.
//? cd ..	

//? ajoutez ces commandes qui servent aussi au Déploiement Quotidien (Le Processus de Mise à Jour)
//? 🔜 1.Compilation Web : Construit votre application Angular.
//? npm run build	 
//? 🔜 2.Correction de Chemin : Déplace les assets du sous-dossier browser au dossier GenCut2 (nécessaire en raison du bogue Capacitor).
//? Move-Item -Path .\dist\GenCut2\browser\* -Destination .\dist\GenCut2\ 
//? 🔜 3. Copie des Assets : Copie le code web compilé vers le projet natif Android.
//? npx cap copy android	
//? 🔜 4. Synchronisation des Plugins : Met à jour la configuration Gradle pour s'assurer que les plugins sont inclus.
//? npx cap sync android	
//? 🔜 5. Entrée dans le Projet Natif : Change le répertoire de travail.
//? cd .\android	
//? 🔜 6. Compilation APK : Construit l'application en mode débogage.
//? .\gradlew assembleDebug	
//? 🔜 7. Installation Finale : Installe l'APK sur le téléphone branché.
//? adb install app\build\outputs\apk\debug\app-debug.apk	

//? ************* pour déployer l'appli sans la supprimer sur le téléphone pour faire des mise à jour ***************
//? 🔜 1. Construire l'application Angular pour la production Ceci génère les fichiers optimisés dans le dossier 'dist'
//? npm run build 
//? 🔜 2.Correction de Chemin : Déplace les assets du sous-dossier browser au dossier GenCut2 (nécessaire en raison du bogue Capacitor).
//? Move-Item -Path .\dist\GenCut2\browser\* -Destination .\dist\GenCut2\ 
//? 🔜 2. Synchroniser les nouveaux fichiers web avec le projet Capacitor Android
//? npx cap sync android	
//? 🔜 3. Exécuter l'application sur votre appareil Android
//? npx cap run android	