import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, LucideDynamicIcon],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.css',
})
export class Dropdown {
  /** Danh sách option */
  @Input() options: Array<{ label: string; value: any }> = [];
  /** Giá trị đang chọn */
  @Input() value: any;
  /** Placeholder */
  @Input() placeholder: string = 'Chọn';
  /** Disabled */
  @Input() disabled: boolean = false;
  /** Custom class */
  @Input() className: string = '';
  /** Sự kiện chọn option */
  @Output() valueChange = new EventEmitter<any>();

  isOpen = false;

  get selectedLabel(): string {
    return this.options.find(o => o.value === this.value)?.label ?? '';
  }

  toggle() {
    if (!this.disabled) this.isOpen = !this.isOpen;
  }

  onSelect(val: any) {
    if (!this.disabled) {
      this.valueChange.emit(val);
      this.isOpen = false;
    }
  }

  // Đóng khi click ra ngoài
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const el = event.target as HTMLElement;
    if (!el.closest('app-dropdown')) {
      this.isOpen = false;
    }
  }
}
