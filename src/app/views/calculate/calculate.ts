import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule, // Nécessaire pour les Reactive Forms
  Validators,
  NgForm,
  FormControl, // Gardé au cas où, mais moins utile avec Reactive Forms
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Card } from '../../shared/components/card/card';
import { InputNumber } from '../../shared/components/forms/input-number/input-number';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Button } from '../../shared/components/button/button';
import { Error } from '../../shared/components/forms/error/error';
import { Dialog, DialogData } from '../../shared/components/dialog/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CheckBox } from '../../shared/components/check-box/check-box';
import { LocalStorageService } from '../../utils/local-storage.service.js';

@Component({
  selector: 'app-calculate',
  standalone: true,
  imports: [
    Card,
    InputNumber,
    ReactiveFormsModule, // Utilisé pour [formGroup] et FormArray
    CommonModule,
    MatButtonModule,
    MatIconModule,
    Button,
    Error,
    MatTableModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    CheckBox,
  ],
  templateUrl: './calculate.html', // Assurez-vous que le HTML utilise [formGroup], formArrayName, etc.
  styleUrl: './calculate.scss',
})
export class Calculate {
  tableData: any[] = []; // Contient le résumé des résultats
  displayedColumns: string[] = ['longueur', 'pr', 'quantite'];
  perteAuto!: number;
  nombreTotalPalettes?: number;
  meilleurePerteTotale: number | null = null;
  resultats: {
    longueurPalette: number;
    perteTotale: number;
    pourcentage: number;
    groupes: { motif: number[]; count: number; checked: boolean }[];
  }[] = [];

  //? *******************************************************************
  private dialog = inject(MatDialog);
  private localStorageService = inject(LocalStorageService);
  private fb = inject(FormBuilder);

  //? ****************** Propriétés de l'application *********************
  titleCard = 'Entrez vos données, longueurs des morceaux et des palettes';
  buttonText = 'Ajouter un morceau';
  buttonTextPalette = 'Ajouter une palette';
  toggleBoolean: boolean = false;
  isAccepted=false;

  //? Règle de validation pour le pattern (1 à 4 chiffres)
  private readonly patternDigit2_4 = Validators.pattern(/^\d{2,4}$/);
  private readonly patternDigit4 = Validators.pattern(/^\d{1,4}$/);

  //? ****************** Définition des FormGroups et FormArrays *********************

  //? ********* Définition des FormGroup *************************
  createMorceauGroup(): FormGroup {
    return this.fb.group({
      longueur: [
        null,
        [Validators.required, this.patternDigit2_4, Validators.min(1)],
      ],
      quantite: [
        null,
        [Validators.required, this.patternDigit4, Validators.min(1)],
      ],
    });
  }

  createPaletteGroup(): FormGroup {
    return this.fb.group({
      longueur: [
        null,
        [Validators.required, this.patternDigit4, Validators.min(1500)],
      ],
    });
  }

  purgeControl = new FormControl('auto');

  //? ******** Définition du Formulaire Racines (FormGroup principal) *************
  formUser = this.fb.group({
    morceaux: this.fb.array([this.createMorceauGroup()]),
    palettes: this.fb.array([this.createPaletteGroup()]),
  });

  //? ********* Getters pour un accès facile aux FormArray dans le template ***********
  get morceaux(): FormArray {
    return this.formUser.get('morceaux') as FormArray;
  }

  get palettes(): FormArray {
    return this.formUser.get('palettes') as FormArray;
  }

  //? ****************** Gestion des Listes *********************

  addMorceau() {
    this.morceaux.push(this.createMorceauGroup());
  }

  removeMorceau(index: number) {
    this.morceaux.removeAt(index);
    if (this.morceaux.length === 0)
      this.morceaux.push(this.createMorceauGroup());
  }

  addPalette() {
    this.palettes.push(this.createPaletteGroup());
  }

  removePalette(index: number) {
    this.palettes.removeAt(index);
    if (this.palettes.length === 0)
      this.palettes.push(this.createPaletteGroup());
  }

  onCheckboxChange(event: any){
    console.log("event= ",event)
  }

  //? ****************** Gestion des Données et Validation *********************
  saveResultsToLocalStorage(){
    this.localStorageService.saveOptimizationResults(this.resultats,this.purgeControl.value)
  }

  onSubmit() {
    if (this.formUser.invalid) {
      this.formUser.markAllAsTouched();
      return;
    }
    const purgeChoisie = this.purgeControl.value;
    if (purgeChoisie == 'auto') {
      this.perteAuto = 20;
      this.toggleBoolean = false;
    } else {
      this.perteAuto = 50;
      this.toggleBoolean = true;
    }

    this.resultats = [];
    this.meilleurePerteTotale = null;

    const formValue = this.formUser.value;

    const morceauxData = formValue.morceaux as {
      longueur: number;
      quantite: number;
    }[];
    const palettesData = formValue.palettes as { longueur: number }[];

    //? Conversion au format [longueur, quantite][] pour l'algorithme
    const listeMorceaux: [number, number][] = morceauxData
      .filter((m) => m.longueur && m.quantite) // Théoriquement toujours vrais si valide
      .map((m) => [m.longueur!, m.quantite!]);

    const paletteLengths: number[] = palettesData
      .filter((p) => p.longueur)
      .map((p) => p.longueur!);

    //? Trouver la longueur maximale d'un morceau demandé (logique conservée)
    const plusLongMorceau = Math.max(
      ...listeMorceaux.map(([longueur, _]) => longueur + 20)
    );

    this.resultats = paletteLengths
      .map((l) => this.calculerDecoupePourPalette(l, listeMorceaux))
      .filter(
        (r) => r !== null && r.longueurPalette >= plusLongMorceau
      ) as typeof this.resultats;

    //? Détermination du meilleur résultat (logique conservée)
    if (this.resultats.length > 0) {
      const meilleur = this.resultats.reduce((a, b) => {
        if (a.longueurPalette !== b.longueurPalette) {
          return b.longueurPalette > a.longueurPalette ? b : a;
        } else {
          return a.perteTotale < b.perteTotale ? a : b;
        }
      });

      this.meilleurePerteTotale = meilleur.perteTotale;
      this.nombreTotalPalettes = meilleur.groupes.reduce(
        (acc, g) => acc + g.count,
        0
      );

      if (this.resultats && this.resultats.length > 0) {
        // Trouver la plus petite perte totale parmi toutes les entrées
        let minPerte = Infinity;

        this.resultats.forEach((res) => {
          // Assurez-vous que 'res' a une propriété 'perteTotale' numérique
          if (res.perteTotale < minPerte) {
            minPerte = res.perteTotale;
          }
        });

        this.meilleurePerteTotale = minPerte;
      }
    } else {
      this.meilleurePerteTotale = null;
      this.nombreTotalPalettes = 0;
    }
  }

  isMeilleurResultat(perteTotale: number): boolean {
    //? Vérifie si la perteTotale de l'élément est égale à la meilleure perte trouvée (la plus petite).
    //? Nous utilisons une petite tolérance pour les comparaisons de nombres à virgule flottante si besoin,
    //? mais pour les entiers, l'égalité stricte suffit.
    return (
      this.meilleurePerteTotale !== null &&
      perteTotale === this.meilleurePerteTotale
    );
  }

  //? ****************** Algorithme de Découpe (logique conservée) *********************

  calculerDecoupePourPalette(
    longueurPalette: number,
    listeMorceaux: [number, number][]
  ) {
    const perteAuto = this.perteAuto;
    let longueurUtile = longueurPalette - perteAuto;
    const palettes: number[][] = [];

    //? Trie décroissant par longueur
    const morceauxTries = [...listeMorceaux].sort((a, b) => b[0] - a[0]);

    for (const [longueur, quantite] of morceauxTries) {
      for (let i = 0; i < quantite; i++) {
        let placeTrouvee = false;

        for (const palette of palettes) {
          const sommePalette = palette.reduce((acc, val) => acc + val, 0);
          if (sommePalette + longueur <= longueurUtile) {
            palette.push(longueur);
            placeTrouvee = true;
            break;
          }
        }

        if (!placeTrouvee) {
          palettes.push([longueur]);
        }
      }
    }

    //? Regroupement par motif identique
    const groupesMap = new Map<string, { motif: number[]; count: number }>();

    for (const palette of palettes) {
      const motif = palette.slice().sort((a, b) => a - b);
      const key = motif.join('+');
      if (groupesMap.has(key)) {
        groupesMap.get(key)!.count++;
      } else {
        groupesMap.set(key, { motif, count: 1 });
      }
    }

    let perteTotale = 0;
    for (const palette of palettes) {
      const sommePalette = palette.reduce((acc, val) => acc + val, 0);
      perteTotale += longueurPalette - sommePalette;
    }

    //? Calcul du Pourcentage de PERTE (formule demandée)
    const longueurTotalePalettes = palettes.length * longueurPalette;

    //? Pourcentage de perte = (Perte Totale / Longueur Totale Palettes) * 100
    const pourcentagePerte =
      longueurTotalePalettes > 0
        ? (perteTotale / longueurTotalePalettes) * 100
        : 0;

    return {
      longueurPalette, // longueur brute
      perteTotale,
      pourcentage: parseFloat(pourcentagePerte.toFixed(2)),
      groupes: Array.from(groupesMap.values()),
    };
  }

  //? ****************** Outils d'Affichage (logique conservée) *********************

  totalPalettes(groupes: { motif: number[]; count: number }[]): number {
    return groupes.reduce((acc, g) => acc + g.count, 0);
  }

  formaterMotif(motif: number[]): string {
    return motif.join(' + ');
  }

  getLongueurMotif(motif: number[]): number {
    return motif.reduce((acc, val) => acc + val, 0);
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

  openDialog(): void {
    this.openActionDialog({
      title: 'Confirmation', // Titre ajusté selon la demande
      message:
        'Êtes-vous certain de vouloir effacer toutes les données et les résultats ?', // Message ajusté
      isConfirmation: true, // Crucial pour afficher les boutons Oui/Non
    }).subscribe((result) => {
      if (result === true) {
        this.resetForm(); 
      }
    });
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

  resetForm() {
    //? 1.nettoyage
    while (this.morceaux.length !== 0) {
      this.morceaux.removeAt(0);
    }
    while (this.palettes.length !== 0) {
      this.palettes.removeAt(0);
    }

    //? 2. construction
    this.morceaux.push(this.createMorceauGroup());
    this.palettes.push(this.createPaletteGroup());

    //? 3. réinitialisation
    // Nous appelons reset sans argument pour ne pas écraser les FormArrays qui viennent d'être reconstruits.
    this.formUser.reset();

    //? 4. Réinitialisation des résultats de l'application
    this.resultats = [];
    this.meilleurePerteTotale = null;
    this.nombreTotalPalettes = undefined;
  }

  toggleMotifSelection(groupe: any): void {}
}
