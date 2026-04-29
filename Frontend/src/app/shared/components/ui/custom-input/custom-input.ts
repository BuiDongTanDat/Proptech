import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [CommonModule, LucideDynamicIcon],
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.css',
})
export class CustomInput {

  // ===== VALUE =====
  @Input() value: string = '';

  // ===== PLACEHOLDER =====
  @Input() placeholder: string = '';

  // ===== VARIANT =====
  @Input() variant: 'primary' | 'outline' | 'ghost' = 'primary';

  // ===== DISABLED =====
  @Input() disabled: boolean = false;

  // ===== ICON =====
  @Input() icon?: string;

  // ===== CUSTOM CLASS =====
  @Input() className: string = '';

  // ===== EVENT =====
  @Output() valueChange = new EventEmitter<string>();

  // =========================
  // VARIANT CLASSES
  // =========================
  get variantClasses(): string {
    switch (this.variant) {
      case 'outline':
        return 'bg-white border border-gray-300 focus:border-primary hover:border-gray-500 hover:border-1.5';
      case 'ghost':
        return 'border border-transparent focus:border-primary bg-gray-50 hover:bg-gray-100';
      default:
        return 'border border-gray-200 focus:border-primary bg-white hover:border-gray-300 hover:border-1.5';
    }
  }

  // =========================
  // DISABLED
  // =========================
  get disabledClasses(): string {
    return this.disabled ? 'opacity-50 cursor-not-allowed' : '';
  }

  // =========================
  // HANDLE INPUT
  // =========================
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.valueChange.emit(value);
  }
}