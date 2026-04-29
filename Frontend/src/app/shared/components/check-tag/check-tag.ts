import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-check-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './check-tag.html',
  styleUrl: './check-tag.css',
})
export class CheckTag {
  /** Label hiển thị */
  @Input() label: string = '';
  /** Trạng thái đã chọn */
  @Input() checked: boolean = false;
  /** Disabled */
  @Input() disabled: boolean = false;
  /** Custom class */
  @Input() className: string = '';
  /** Sự kiện click */
  @Output() tagClick = new EventEmitter<void>();

  onClick() {
    if (!this.disabled) {
      this.tagClick.emit();
    }
  }
}
