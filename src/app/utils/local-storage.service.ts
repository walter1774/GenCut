import { Injectable } from '@angular/core';

// Définition simplifiée des types pour le stockage
interface SavedOptimizationData {
  results: any[]; // Le tableau des résultats d'optimisation (votre `res.groupes` etc.)
  purgeMode: 'auto' | '40'; // Le mode de purge sélectionné
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  
  private readonly RESULTS_KEY = 'decoupeOptimisationResults';
  private readonly PURGE_KEY = 'purge';

  constructor() { }

  /**
   * Enregistre les résultats d'optimisation et le mode de purge choisi.
   * @param results Le tableau complet des résultats d'optimisation.
   * @param purgeControlValue La valeur du contrôle de la purge ('auto' ou '40').
   */
  saveOptimizationResults(results: any[], purgeControlValue: string | null): void {
    if (!results || results.length === 0) {
      console.warn("Service d'enregistrement: Aucun résultat valide à enregistrer.");
      return;
    }

    try {
      // 1. Détermine le mode de purge
      const purgeMode: 'auto' | '40' = purgeControlValue === 'auto' ? 'auto' : '40';

      // 2. Sauvegarde les résultats
      const resultsJson = JSON.stringify(results);
      localStorage.setItem(this.RESULTS_KEY, resultsJson);
      
      // 3. Sauvegarde le mode de purge
      localStorage.setItem(this.PURGE_KEY, purgeMode);

      console.log(`Résultats et mode de purge (${purgeMode}) sauvegardés avec succès.`);

    } catch (e) {
      console.error("Erreur lors de la sauvegarde dans le LocalStorage:", e);
      // Gérer ici les erreurs de quota (si le stockage est plein)
    }
  }

  /**
   * Charge les résultats d'optimisation et le mode de purge.
   * @returns Un objet contenant les résultats et le mode de purge, ou null si rien n'est trouvé.
   */
  loadOptimizationResults(): SavedOptimizationData | null {
    try {
      const resultsJson = localStorage.getItem(this.RESULTS_KEY);
      const purgeMode = localStorage.getItem(this.PURGE_KEY) as 'auto' | '40' | null;

      if (resultsJson && purgeMode) {
        const results = JSON.parse(resultsJson);
        return {
          results: results,
          purgeMode: purgeMode
        };
      }
    } catch (e) {
      console.error("Erreur lors du chargement depuis le LocalStorage:", e);
    }
    return null;
  }

  /**
   * Nettoie les données sauvegardées.
   */
  clearSavedResults(): void {
      localStorage.removeItem(this.RESULTS_KEY);
      localStorage.removeItem(this.PURGE_KEY);
      console.log("Résultats de découpe effacés du LocalStorage.");
  }
}
