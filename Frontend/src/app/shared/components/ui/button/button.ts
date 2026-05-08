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
  @Input() variant: 'primary' | 'secondary' | 'accent' | 'outline' | 'white' | 'ghost' | 'icon' | 'destructive' | 'action' = 'primary';

  // ===== SIZE =====
  @Input() size: 'sm' | 'md' | 'lg' | 'icon' = 'md';

  // ===== TYPE =====
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

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
      case 'icon':
        return 'p-2'; // Chỉ có padding, không có text
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
        return 'bg-white border border-gray-200 text-primary/90 hover:bg-gray-100 hover:text-primary';
      case 'ghost':
        return 'bg-transparent text-gray-400 hover:text-primary hover:bg-gray-100 border-none p-0 m-0';
      case 'icon': // <-- Thêm cái này để làm nút chỉ có icon
        return 'bg-transparent text-gray-400 hover:text-primary border-none p-0 m-0';
      case 'destructive':
        return 'border border-red-100 text-red-400 bg-red-100 hover:bg-red-500 hover:border-red-500 hover:text-white ';
      case 'action':
        return 'bg-white border border-gray-200 text-primary/90 hover:bg-primary hover:border-primary hover:text-white';
      default:
        return 'bg-primary hover:bg-tertiary text-white border border-primary hover:border-tertiary';
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