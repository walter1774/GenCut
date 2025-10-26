import { CommonModule } from '@angular/common';
import { Component, Input, booleanAttribute, forwardRef } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { BaseControlValueAccessor } from '../../../../utils/base-control-value-accessor.js';

@Component({
  selector: 'app-input-number',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ // <-- CE BLOC EST ESSENTIEL
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumber), // Doit pointer vers la classe actuelle
      multi: true,
    },
  ],
  template: `
    <div class="container">
      <label
        [for]="id"
        [ngClass]="{
          required: required || control.hasValidator(Validators.required)
        }"
      >
        {{ label }}
      </label>
      <input
        #input
        [id]="id"
        [placeholder]="placeholder"
        [value]="value"
        (focusout)="onTouch()"
        (input)="handleChange($event)"
        type="number"
        step="{{ step }}"
        min="{{ min }}"
      />
    </div>
    <div class="error-container">
      <ng-container *ngIf="control?.touched">
        <ng-content select="app-error" />
      </ng-container>
    </div>
  `,
  styleUrl: './input-number.scss',
})
export class InputNumber extends BaseControlValueAccessor<number> {
  protected readonly Validators = Validators;
  @Input({ required: true }) id!: string;
  @Input({ required: true }) label!: string;
  @Input({ transform: booleanAttribute }) required = false;
  @Input() placeholder = '';
  @Input() step!: number;
  @Input() min!: number;

  handleChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.valueAsNumber ?? 0; // Utilisation de ?? pour fournir une valeur par défaut
    this.onChange(value);
  }
}
