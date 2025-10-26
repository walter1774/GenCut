import { CommonModule } from '@angular/common';
import { booleanAttribute, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  template: `
    <button
      (click)="onClick()"
      severity="contrast"
      [type]="type"  [disabled]="disabled" [ngClass]="{
        basic: background === 'basic',
        red: background === 'red',
        green: background === 'green',
        unvalid: background === 'unvalid'
      }"
      label="{{texte}"
    >
      {{ texte }}
    </button>
  `,
  styleUrl: './button.scss',
})
export class Button {
  @Input() texte?: string;
  @Input() background?: string;
  @Input() type: 'button' | 'submit' = 'button'; // 'button' par défaut
  @Input({ transform: booleanAttribute }) disabled: boolean = false; // Désactivé par défaut 
  @Output() buttonClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  onClick(): void {
     if (this.type !== 'submit' && !this.disabled) { // Évite d'émettre un événement si c'est un submit natif
        this.buttonClicked.emit();
    }
  }
}
