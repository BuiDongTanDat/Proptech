import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  /** Trang hiện tại */
  @Input() currentPage: number = 1;
  /** Tổng số trang */
  @Input() totalPages: number = 1;
  /** Số trang hiển thị tối đa */
  @Input() maxVisible: number = 5;
  /** Disabled */
  @Input() disabled: boolean = false;
  /** Custom class */
  @Input() className: string = '';
  /** Sự kiện chuyển trang */
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    const pages: number[] = [];
    let start = Math.max(1, this.currentPage - Math.floor(this.maxVisible / 2));
    let end = start + this.maxVisible - 1;
    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(1, end - this.maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number) {
    if (!this.disabled && page !== this.currentPage && page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
