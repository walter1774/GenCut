import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

// Interface pour typer les données reçues par le dialogue
export interface DialogData {
  title: string;
  message: string;
  // Optionnel: déterminer si le dialogue doit avoir des actions Oui/Non
  isConfirmation?: boolean; 
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  template: `
     <h1 mat-dialog-title class="dialog-title">{{data.title}}</h1>
    <div mat-dialog-content>
      <p>{{data.message}}</p>
    </div>
    
    <div mat-dialog-actions align="end">
      <!-- Confirmation Mode (Oui/Non) -->
      <ng-container *ngIf="data.isConfirmation; else alertMode">
        <!-- [mat-dialog-close]="false" retourne false (Non) après la fermeture -->
        <button mat-button [mat-dialog-close]="false" color="warn">Non</button>
        
        <!-- [mat-dialog-close]="true" retourne true (Oui) après la fermeture -->
        <button mat-raised-button [mat-dialog-close]="true" color="primary" cdkFocusInitial>Oui</button>
      </ng-container>

      <!-- Alert Mode (Fermer seulement) -->
      <ng-template #alertMode>
        <button mat-button mat-dialog-close cdkFocusInitial>Fermer</button>
      </ng-template>
    </div>
  `,
  styleUrl: './dialog.scss'
})
export class Dialog {

    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {};


}
