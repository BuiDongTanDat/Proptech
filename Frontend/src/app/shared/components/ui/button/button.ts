import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, LucideDynamicIcon],
  templateUrl: './button.html',
  styleUrl: './button.css',
})
export class Button {

  // ===== VARIANT =====
  // primary | secondary | accent | outline
  @Input() variant: 'primary' | 'secondary' | 'accent' | 'outline' | 'white' = 'primary';

  // ===== SIZE =====
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  // ===== STATE =====
  @Input() disabled: boolean = false;

  // ===== CUSTOM CLASS =====
  // Cho phép truyền thêm class từ ngoài
  @Input() className: string = '';

  // ===== ICON =====
  @Input() startIcon?: string;
  @Input() endIcon?: string;

  // ===== EVENT =====
  @Output() btnClick = new EventEmitter<Event>();


  // =========================
  // SIZE CLASSES
  // =========================
  get sizeClasses(): string {
    switch (this.size) {
      case 'sm':
        return 'px-3 py-1 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-sm';
    }
  }

  // =========================
  // VARIANT CLASSES (ăn theo styles.css của bạn)
  // =========================
  get variantClasses(): string {
    switch (this.variant) {
      case 'secondary':
        return 'bg-secondary hover:bg-white text-white';
      case 'white':
        return 'bg-white text-primary hover:bg-primary hover:text-white';
      case 'accent':
        return 'bg-tertiary hover:bg-orange-500 text-white';
      case 'outline':
        return 'bg-transparent border border-white text-white hover:bg-primary hover:text-white';
      default:
        return 'bg-primary hover:bg-tertiary text-white';
    }
  }

  // =========================
  // DISABLED
  // =========================
  get disabledClasses(): string {
    return this.disabled ? 'opacity-50 cursor-not-allowed' : '';
  }

  // =========================
  // CLICK HANDLER
  // =========================
  onClick(event: Event) {
    if (!this.disabled) {
      this.btnClick.emit(event);
    }
  }
}