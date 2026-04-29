import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
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

  onSelect(val: any) {
    if (!this.disabled) {
      this.valueChange.emit(val);
    }
  }
}
