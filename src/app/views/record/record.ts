import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Dialog, DialogData } from '../../shared/components/dialog/dialog';
import { Button } from '../../shared/components/button/button';
import { Card } from '../../shared/components/card/card';
import { CheckBox } from '../../shared/components/check-box/check-box.js';
import { LocalStorageService } from '../../utils/local-storage.service.js';
import { MatrixBackground } from '../../shared/components/matrix-background/matrix-background';

interface GroupeMotif {
  motif: number[];
  count: number;
  checked: boolean; // Ajout du statut de sélection
}
interface ResultatDecoupe {
  longueurPalette: number;
  perteTotale: number;
  pourcentage: number;
  groupes: GroupeMotif[];
}

interface SavedResult extends ResultatDecoupe {
  timestamp: number;
}

@Component({
  selector: 'app-record',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    DecimalPipe,
    Button,
    Card,
    CheckBox,
    MatrixBackground
  ],
  templateUrl: './record.html', // Assurez-vous que le HTML utilise [formGroup], formArrayName, etc.
  styleUrl: './record.scss',
})
export class Record implements OnInit {
  private dialog = inject(MatDialog);

  private readonly STORAGE_KEY = 'decoupeOptimisationResults';

  dataSource: SavedResult[] = [];
  displayedColumns: string[] = [
    'date',
    'palette',
    'perteTotale',
    'pourcentage',
    'selection',
  ];

  private localStorageService = inject(LocalStorageService);

  // Nouvelle propriété pour stocker le résultat sélectionné pour l'affichage détaillé
  selectedResult: SavedResult | null = null;

  ngOnInit(): void {
    this.loadHistory();
  }

  showDetails(result: SavedResult): void {
    this.selectedResult = result;
  }

    //? ******** LOGIQUE NOUVELLE : Vérifie si au moins un motif a été coché ********
  isResultSelected(result: SavedResult): boolean {
    // Retourne true si au moins un groupe a la propriété 'checked' à true
    return result.groupes?.some(g => g.checked) ?? false;
  }

  //? ******** retour à la vue historique **********
  goBack(): void {
    this.selectedResult = null;
  }

  //? ******** Calcule le nombre total de planches dans l'ensemble des groupes d'un résultat **********

  calculerNombreTotalPlanches(result: SavedResult): number {
    return result.groupes.reduce((sum, group) => sum + group.count, 0);
  }

  //? ******** Calcule la longueur totale du motif de coupe **********
  private calculerLongueurMotif(motif: number[]): number {
    return motif.reduce((a, b) => a + b, 0);
  }

  calculerPerteParPlanche(result: SavedResult, motif: number[]): number {
    return result.longueurPalette - this.calculerLongueurMotif(motif);
  }

  calculerPurgeRecommandee(result: SavedResult, motif: number[]): string {
    const perte = this.calculerPerteParPlanche(result, motif);
    const purge = localStorage.getItem('purge');
    if (purge == 'auto') {
      return (perte / 2).toFixed(1);
    } else {
      return (perte + 40 - perte).toFixed(1);
    }
  }

  loadHistory(): void {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY);
      if (storedData) {
        // Le JSON.parse est souvent nécessaire pour les données de type ResultatDecoupe
        let rawData: any[] = JSON.parse(storedData);

        // S'assurer que les données sont valides et trier par date du plus récent au plus ancien
        this.dataSource = rawData
          // 1. Filtrer les éléments qui sont des objets valides et contiennent au moins les clés de ResultatDecoupe
          .filter(
            (item) =>
              item &&
              typeof item === 'object' &&
              item.longueurPalette !== undefined &&
              item.perteTotale !== undefined
          )
          // 2. Ajouter un timestamp si manquant (pour la compatibilité avec les anciennes données)
          .map((item) => {
            if (!item.timestamp || typeof item.timestamp !== 'number') {
              item.timestamp = Date.now();
            }
            return item as SavedResult;
          })
          .sort((a, b) => b.timestamp - a.timestamp); // Tri par date du plus récent au plus ancien
      } else {
        this.dataSource = [];
      }
    } catch (e) {
      console.error("Erreur lors du chargement de l'historique:", e);
      this.dataSource = [];
      this.dialog.open(Dialog, {
        data: {
          title: 'Erreur',
          message:
            "Impossible de lire les données de l'historique. Le format est peut-être corrompu.",
        } as DialogData,
      });
    }
  }

  confirmClearHistory(): void {
    const dialogRef = this.dialog.open(Dialog, {
      data: {
        title: 'Confirmation de Suppression',
        message:
          "Êtes-vous certain de vouloir supprimer tout l'historique des enregistrements ? Cette action est irréversible.",
        isConfirmation: true,
      } as DialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.clearHistory();
      }
    });
  }

  clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.loadHistory(); // Recharger pour vider le tableau dans l'interface

    this.dialog.open(Dialog, {
      data: {
        title: 'Succès',
        message: "L'historique a été vidé.",
      } as DialogData,
    });
  }

  //? ********* Formate un tableau de nombres en chaîne pour l'affichage (ex: [514, 514] -> "514+514 *********
  formatMotif(motif: number[], separator: string = 'x'): string {
    return motif.join(separator);
  }

  //? ********* Retourne la classe CSS appropriée en fonction du pourcentage de perte. *********
  getPerteClass(pourcentage: number): string {
    if (pourcentage <= 5) return 'perte-faible';
    if (pourcentage <= 10) return 'perte-moyenne';
    return 'perte-elevee';
  }

  private getPurgeMode(): string | null {
  return localStorage.getItem('purge'); // Retourne 'auto' ou '40'
}

   saveResultsToLocalStorage(){
    this.localStorageService.saveOptimizationResults(this.dataSource,this.getPurgeMode())
  }

  openActionDialog(data: DialogData) {
    return this.dialog
      .open(Dialog, {
        data: data,
        width: '400px', // Taille standard pour le dialogue
        disableClose: true, // Empêche la fermeture par clic en dehors
      })
      .afterClosed();
  }

  openSaveDialog(): void {
    this.openActionDialog({
      title: 'Confirmation', // Titre ajusté selon la demande
      message:
        'Êtes-vous certain de vouloir enregistrer ces données et perdre les dernières enregistrées?', // Message ajusté
      isConfirmation: true, // Crucial pour afficher les boutons Oui/Non
    }).subscribe((result) => {
      if (result === true) {
        this.saveResultsToLocalStorage(); 
      }
    });
  }

  toggleMotifSelection(groupe: any): void {}
}
