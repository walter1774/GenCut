import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatToolbarModule,MatIconModule,
    MatButtonModule,
    MatTooltipModule ],
  template:`<mat-toolbar color="primary" class="app-footer">
    <button matIconButton class="example-icon" matTooltip="home" (click)="toHome()">
        <mat-icon>home</mat-icon>
      </button>
    <button matIconButton class="example-icon" matTooltip="calculer" (click)="toCalculate()">
        <mat-icon>build</mat-icon>
      </button>
      <button matIconButton class="example-icon" matTooltip="enregistrement" (click)="toRecord()">
        <mat-icon>play_arrow</mat-icon>
      </button>
</mat-toolbar>
`,
  styleUrl: './footer.scss'
})
export class Footer {

  constructor(public router: Router) {}
  
  toHome() {
    this.router.navigate(['/home']);
  }
  toCalculate() {
    this.router.navigate(['/calculate']);
  }
  toRecord() {
    this.router.navigate(['/record']);
  }
}
