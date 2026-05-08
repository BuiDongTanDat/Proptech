import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [CommonModule, LucideDynamicIcon],
  templateUrl: './custom-input.html',
  styleUrl: './custom-input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInput),
      multi: true,
    },
  ],
})
export class CustomInput implements ControlValueAccessor {

  // ===== VALUE =====
  value: string = '';

  // ===== INPUT PROPS =====
  @Input() placeholder: string = '';
  @Input() variant: 'primary' | 'outline' | 'ghost' = 'primary';
  @Input() disabled: boolean = false;
  @Input() icon?: string;
  @Input() className: string = '';
  @Input() type: string = 'text';

  // ===== ControlValueAccessor =====
  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // ===== HANDLE INPUT =====
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  // ===== VARIANT CLASSES =====
  get variantClasses(): string {
    switch (this.variant) {
      case 'outline':
        return 'bg-white border border-gray-300 focus:border-primary hover:border-gray-500';
      case 'ghost':
        return 'border border-transparent focus:border-primary bg-gray-50 hover:bg-gray-100';
      default:
        return 'border border-gray-200 focus:border-primary bg-white hover:border-gray-300';
    }
  }

  // ===== DISABLED =====
  get disabledClasses(): string {
    return this.disabled ? 'opacity-50 cursor-not-allowed' : '';
  }
}