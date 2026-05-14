import {
  Component,
  forwardRef,
  HostListener,
  Input,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CustomInput } from '../ui/custom-input/custom-input';

@Component({
  selector: 'app-custom-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomInput],
  templateUrl: './custom-date-picker.html',
  styleUrl: './custom-date-picker.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDatePicker),
      multi: true,
    },
  ],
})
export class CustomDatePicker implements ControlValueAccessor {
  @Input() placeholder = 'Chọn ngày';
  @Input() label = '';
  @Input() disabled = false;

  isOpen = signal(false);

  value = '';

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  // mở / đóng popup
  toggleCalendar() {
    if (this.disabled) return;

    this.isOpen.update((v) => !v);
  }

  closeCalendar() {
    this.isOpen.set(false);
  }

  // chọn ngày
  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;

    this.value = input.value;

    this.onChange(this.value);
    this.onTouched();

    this.closeCalendar();
  }

  // ControlValueAccessor
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

  // click outside
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.custom-date-picker')) {
      this.closeCalendar();
    }
  }
}