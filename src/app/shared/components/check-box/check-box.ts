import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-check-box',
  standalone: true,
  imports: [FormsModule],
  template: `
  <label class="neumorphic-container">
  <input type="checkbox" [(ngModel)]="checked" (change)="onToggle()">

  <span class="checkbox-visual"></span>

  <span class="label-text">
    {{ label }}
  </span>
</label>
`,
  styleUrl: './check-box.scss'
})
export class CheckBox {

   // Entrée pour l'état de la checkbox
  @Input() checked: boolean = false;
  @Input() label: string = 'Check me';

  // Sortie pour notifier le parent du changement d'état
  @Output() checkedChange = new EventEmitter<boolean>();

  // Émet l'événement de changement
  onToggle(): void {
    this.checkedChange.emit(this.checked);
  }
}
