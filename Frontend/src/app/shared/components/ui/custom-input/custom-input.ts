
import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';
import { Injector } from '@angular/core';
import { NgControl } from '@angular/forms';

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
  private onChange = (value: string) => { };
  private onTouched = () => { };

  constructor(private injector: Injector) { }
  //NgControl: Là lớp cha của tất cả các directive quản lý form trong Angular
  get ngControl(): NgControl | null {
    return this.injector.get(NgControl, null);
  }

  // Kiểm tra invalid rồi trả về, xuống dưới variant xét
  get isInvalid(): boolean {
    const control = this.ngControl?.control;

    return !!(
      control &&
      control.invalid &&
      (control.touched || control.dirty)
    );
  }
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
    if (this.disabled) {
      return 'border border-gray-200';
    }

    if (this.isInvalid) {
      return `
      bg-white
      border border-red-500
      focus:border-red-500
      hover:border-red-500
    `;
    }

    switch (this.variant) {
      case 'outline':
        return 'bg-white border border-gray-300 focus:border-primary hover:border-gray-500 text-primary';

      case 'ghost':
        return 'border border-transparent focus:border-primary bg-gray-50 hover:bg-gray-100 text-primary';

      default:
        return 'border border-gray-200 focus:border-primary bg-white hover:border-gray-300 text-primary';
    }
  }

  // ===== DISABLED =====
  get disabledClasses(): string {
    return this.disabled
      ? 'bg-gray-50 text-primary cursor-not-allowed border-gray-200'
      : '';
  }

}