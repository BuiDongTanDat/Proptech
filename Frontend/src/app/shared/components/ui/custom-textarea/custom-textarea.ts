import { Component, Input, forwardRef, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';

@Component({
  selector: 'app-custom-textarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-textarea.html',
  styleUrl: './custom-textarea.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomTextarea),
      multi: true,
    },
  ],
})
export class CustomTextarea implements ControlValueAccessor {
  value: string = '';

  @Input() placeholder: string = '';
  @Input() variant: 'primary' | 'outline' | 'ghost' = 'primary';
  @Input() disabled: boolean = false;
  @Input() className: string = '';
  @Input() rows: number = 4;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor(private injector: Injector) {}

  get ngControl(): NgControl | null {
    return this.injector.get(NgControl, null);
  }

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

  onInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  get variantClasses(): string {
    if (this.disabled) {
      return 'border border-gray-200';
    }
    if (this.isInvalid) {
      return 'bg-white border border-red-500 focus:border-red-500 hover:border-red-500';
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

  get disabledClasses(): string {
    return this.disabled
      ? 'bg-gray-50 text-primary cursor-not-allowed border-gray-200'
      : '';
  }
}
