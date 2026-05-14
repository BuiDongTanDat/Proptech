import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BLOCK_LIBRARY, createBlock } from './post-builder.config';
import { BlockType, PageBlock } from './post-builder.type';
import { PostReview } from './post-review/post-review';
import { PostTool } from './post-tool/post-tool';
import { PostView } from './post-view/post-view';
import { LucideDynamicIcon } from '@lucide/angular';
import { Dialog } from '../../../shared/components/dialog/dialog';

@Component({
  selector: 'app-post-builder',
  standalone: true,
  imports: [CommonModule, PostReview, PostTool, PostView, LucideDynamicIcon, Dialog],
  templateUrl: './post-builder.html',
})
export class PostBuilder {
  // Danh sách các block đang có trên page (Biến gửi cho server)
  sections: PageBlock[] = [];

  //Tracking block đang chọn:
  selectedBlock: PageBlock | null = null;
  // Tracking chế độ preview
  isPreviewMode = false;
  // Danh sách các block có sẵn để thêm vào page
  readonly blockLibrary = BLOCK_LIBRARY;


  addBlock(type: BlockType) {
    const newBlock = createBlock(type);
    this.sections.push(newBlock); // Thêm block mới vào cuối page
    this.selectedBlock = newBlock; // Tự động chọn block mới
  }

  openPreview() {
    this.selectedBlock = null; // Bỏ chọn block khi vào chế độ preview
    this.isPreviewMode = true;
  }

  closePreview(): void {
    this.isPreviewMode = false;
  }

  clearPage() {
    if (!confirm('Bạn có chắc muốn xoá toàn bộ trang không?')) return;
    this.sections = [];
    this.selectedBlock = null;
    this.isPreviewMode = false;
  }

  deleteBlock(id: string) {
    this.sections = this.sections.filter(block => block.id !== id);

    if (this.selectedBlock?.id === id) {
      this.selectedBlock = null;
    }
  }

  duplicateBlock(block: PageBlock) {
    const clone: PageBlock = {
      ...structuredClone(block),
      id: crypto.randomUUID(),
    };

    this.sections.push(clone);
    this.selectedBlock = clone;
  }

  moveBlockUp(index: number) {
    if (index === 0) return;

    [this.sections[index - 1], this.sections[index]] = [
      this.sections[index],
      this.sections[index - 1],
    ];
  }

  moveBlockDown(index: number) {
    if (index >= this.sections.length - 1) return;

    [this.sections[index], this.sections[index + 1]] = [
      this.sections[index + 1],
      this.sections[index],
    ];
  }

  onSubmit() {
    // Gửi sections lên server để lưu lại
    console.log('Submitting page with sections:', this.sections);
    alert('Page submitted! Check console for details.');
  }
}