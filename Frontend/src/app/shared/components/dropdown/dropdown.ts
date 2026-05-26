import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  forwardRef,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';

import { LucideDynamicIcon } from '@lucide/angular';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';


@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    CommonModule,
    LucideDynamicIcon,
    FormsModule,
    OverlayModule,
    PortalModule
  ],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Dropdown),
      multi: true,
    },
  ],
})
export class Dropdown implements ControlValueAccessor {

  /** Danh sách option */
  @Input() options: Array<{ label: string; value: any }> = [];

  /** Placeholder */
  @Input() placeholder: string = 'Chọn';

  /** Disabled */
  @Input() disabled: boolean = false;

  /** Custom class */
  @Input() className: string = '';

  value: any = null;

  isOpen = false;

  // ===== CONTROL VALUE ACCESSOR =====

  private onChange: any = () => { };
  private onTouched: any = () => { };

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // ===== GETTER =====

  get selectedLabel(): string {
    return this.options.find(o => o.value === this.value)?.label ?? '';
  }

  // ===== ACTIONS =====

  toggle() {
    if (!this.disabled) {
      this.isOpen = !this.isOpen;
    }
  }

  onSelect(val: any) {

    if (this.disabled) return;

    // update internal state
    this.value = val;

    // notify Angular forms/ngModel
    this.onChange(val);

    this.onTouched();

    // close dropdown
    this.isOpen = false;
  }

  // ===== CLICK OUTSIDE =====

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const el = event.target as HTMLElement;

    if (!el.closest('app-dropdown')) {
      this.isOpen = false;
    }
  }
}