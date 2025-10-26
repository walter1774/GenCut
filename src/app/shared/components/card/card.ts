import { Component } from '@angular/core';
import { ChangeDetectionStrategy,  Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  template: `
    <mat-card class="example-card" appearance="outlined">
      <mat-card-header>
        <mat-card-title>{{ title }}</mat-card-title>
      </mat-card-header>


      <mat-card-content>
        <ng-content></ng-content>
      </mat-card-content>
      <!-- <mat-card-actions>
    <button matButton>LIKE</button>
    <button matButton>SHARE</button>
  </mat-card-actions> -->
    </mat-card>
  `,
  styleUrl: './card.scss'
})
export class Card {
 @Input() imageSrc?: string;
  @Input() title?: string;
  @Input() subtitle?: string;
}
