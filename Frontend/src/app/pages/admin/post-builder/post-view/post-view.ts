import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { COLUMN_WIDTH_STEP, MIN_COLUMN_WIDTH, createColumn } from '../post-builder.config';
import { ColumnContentType, ColumnItem, PageBlock } from '../post-builder.type';
import { LucideDynamicIcon } from '@lucide/angular';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-post-view',
  standalone: true,
  imports: [FormsModule, LucideDynamicIcon, CustomInput, Button],
  templateUrl: './post-view.html',
})
export class PostView implements OnDestroy {

  @Input() sections: PageBlock[] = []; // Danh sách block để hiển thị (nhận từ PostBuilder)
  @Input() selectedBlock: PageBlock | null = null; // Block đang được chọn để chỉnh sửa

  @Output() selectBlock = new EventEmitter<PageBlock>();  // Sự kiện chọn block
  @Output() closeEditor = new EventEmitter<void>(); // Sự kiện đóng chế độ chỉnh sửa
  @Output() deleteBlock = new EventEmitter<string>(); // Sự kiện xóa block (gửi id block)
  @Output() moveBlockUp = new EventEmitter<number>(); // Sự kiện di chuyển block lên (gửi index block)
  @Output() moveBlockDown = new EventEmitter<number>(); // Sự kiện di chuyển block xuống (gửi index block)
  @Output() duplicateBlock = new EventEmitter<PageBlock>(); // Sự kiện copy block (gửi block cần nhân bản)

  // 
  private readonly minWidth = MIN_COLUMN_WIDTH;
  private readonly widthStep = COLUMN_WIDTH_STEP;

  // Column resize state
  private activeResize: {
    boundaryIndex: number;
    barLeft: number;
    barWidth: number;
  } | null = null;

  private readonly onPointerMove = (e: PointerEvent) => this.handleResizeMove(e);
  private readonly onPointerUp = () => this.stopResize();

  // Image upload

  onImageUpload(event: Event, field: 'imageUrl' | 'backgroundImage'): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.selectedBlock) return;
    this.readImage(file, url => {
      this.selectedBlock!.data[field] = url;
    });
  }

  onColumnImageUpload(event: Event, colIndex: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.selectedBlock?.data.columns) return;
    this.readImage(file, url => {
      this.selectedBlock!.data.columns![colIndex].imageUrl = url;
    });
  }

  private readImage(file: File, cb: (url: string) => void): void {
    if (!file.type.startsWith('image/')) { alert('Vui lòng chọn file ảnh.'); return; }
    if (file.size > 3 * 1024 * 1024) { alert('Ảnh tối đa 3MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => cb(reader.result as string);
    reader.readAsDataURL(file);
  }

  // Column management

  addColumn(): void {
    const cols = this.selectedBlock?.data.columns;
    if (!cols) return;
    if (cols.length >= 4) { alert('Tối đa 4 cột.'); return; }
    cols.push(createColumn('text'));
    this.redistributeWidths(cols);
  }

  removeColumn(index: number): void {
    const cols = this.selectedBlock?.data.columns;
    if (!cols) return;
    if (cols.length <= 1) { alert('Cần ít nhất 1 cột.'); return; }
    cols.splice(index, 1);
    this.redistributeWidths(cols);
  }

  changeColumnType(col: ColumnItem, type: ColumnContentType): void {
    col.contentType = type;
    if (type === 'text') {
      col.title = col.title || 'Tiêu đề cột';
      col.content = col.content || 'Nội dung mô tả.';
      col.imageUrl = '';
    } else {
      col.title = '';
      col.content = '';
      col.imageFit = col.imageFit || 'contain';
      col.imageWidth = col.imageWidth || 100;
      col.imageBoxHeight = col.imageBoxHeight || 420;
    }
  }

  //Column resize

  startColumnResize(event: PointerEvent, boundaryIndex: number, bar: HTMLElement): void {
    const cols = this.selectedBlock?.data.columns;
    if (!cols || cols.length < 2) return;

    this.normalizeWidths(cols);
    const rect = bar.getBoundingClientRect();
    this.activeResize = { boundaryIndex, barLeft: rect.left, barWidth: rect.width };

    event.preventDefault();
    event.stopPropagation();
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
  }

  private handleResizeMove(event: PointerEvent): void {
    if (!this.activeResize) return;
    const cols = this.selectedBlock?.data.columns;
    if (!cols) return;

    const bi = this.activeResize.boundaryIndex;
    if (bi < 0 || bi >= cols.length - 1) return;

    this.normalizeWidths(cols);

    const pct = ((event.clientX - this.activeResize.barLeft) / this.activeResize.barWidth) * 100;
    const before = cols.slice(0, bi).reduce((s, c) => s + (c.widthRatio ?? 0), 0);
    const lw = cols[bi].widthRatio ?? 0;
    const rw = cols[bi + 1].widthRatio ?? 0;
    const total = lw + rw;
    const minPos = before + this.minWidth;
    const maxPos = before + total - this.minWidth;

    let newPos = this.snap(pct);
    newPos = this.snap(Math.max(minPos, Math.min(maxPos, newPos)));
    newPos = Math.max(minPos, Math.min(maxPos, newPos));

    cols[bi].widthRatio = newPos - before;
    cols[bi + 1].widthRatio = total - cols[bi].widthRatio!;
    this.normalizeWidths(cols);
  }

  private stopResize(): void {
    this.activeResize = null;
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
  }

  //Grid helpers

  getColumnsGridTemplate(block: PageBlock): string {
    const cols = block.data.columns ?? [];
    if (cols.length === 0) return '1fr';
    this.normalizeWidths(cols);
    return cols.map(c => `${c.widthRatio ?? this.minWidth}%`).join(' ');
  }

  getColumnBoundaryPosition(cols: ColumnItem[] | undefined, boundaryIndex: number): number {
    if (!cols?.length) return 0;
    this.normalizeWidths(cols);
    return this.snap(
      cols.slice(0, boundaryIndex + 1).reduce((s, c) => s + (c.widthRatio ?? 0), 0)
    );
  }

  // Width normalisation 

  private redistributeWidths(cols: ColumnItem[]): void {
    if (cols.length === 0) return;
    const equal = Math.floor(100 / cols.length);
    cols.forEach(c => (c.widthRatio = equal));
    cols[0].widthRatio! += 100 - equal * cols.length;
  }

  private snap(value: number): number {
    return Math.round(value / this.widthStep) * this.widthStep;
  }

  private normalizeWidths(cols: ColumnItem[]): void {
    if (cols.length === 0) return;

    const totalUnits = 10;
    const minUnits = 1;
    const currentTotal = cols.reduce((s, c) => s + (c.widthRatio ?? 0), 0);

    const allValid =
      currentTotal === 100 &&
      cols.every(c => {
        const w = c.widthRatio ?? 0;
        return w >= this.minWidth && w % this.widthStep === 0;
      });

    if (allValid) return;

    const equalWidth = 100 / cols.length;
    const exactUnits = cols.map(c => {
      const w = c.widthRatio ?? 0;
      if (!Number.isFinite(w) || currentTotal <= 0)
        return equalWidth / this.widthStep;
      return ((w / currentTotal) * 100) / this.widthStep;
    });

    const remainders = exactUnits.map((u, i) => ({ i, r: u - Math.floor(u) }));
    const units = exactUnits.map(u => Math.max(minUnits, Math.floor(u)));
    let unitTotal = units.reduce((s, u) => s + u, 0);

    while (unitTotal > totalUnits) {
      let li = -1, lv = -1;
      units.forEach((u, i) => { if (u > minUnits && u > lv) { lv = u; li = i; } });
      if (li === -1) break;
      units[li]--; unitTotal--;
    }

    remainders.sort((a, b) => b.r - a.r);
    let ri = 0;
    while (unitTotal < totalUnits) {
      units[remainders[ri % remainders.length].i]++;
      unitTotal++; ri++;
    }

    cols.forEach((c, i) => (c.widthRatio = units[i] * this.widthStep));
  }

  //
  ngOnDestroy(): void {
    this.stopResize();
  }
}