import { Component, input, output } from '@angular/core';
import { BlockLibraryItem, BlockType } from '../post-builder.type';
import { LucideDynamicIcon } from '@lucide/angular';
import { Button } from '../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-post-tool',
  imports: [
    LucideDynamicIcon,
    Button,

  ],
  templateUrl: './post-tool.html',
  styleUrl: './post-tool.css',
})
export class PostTool {
  // Danh sách các loại block
  blockLibrary = input<ReadonlyArray<BlockLibraryItem>>([]);

  // Emit sự kiện thêm block mới
  addBlock = output<BlockType>();

  // Emit sự kiện xem preview
  openPreview = output<void>();

  // Emit sự kiện xóa block
  clearPage = output<void>();

  // Emit sự kiện submit page
  submitPage = output<void>();

  onAddBlock(type: BlockType) {
    this.addBlock.emit(type);
  }

  onOpenPreview() {
    this.openPreview.emit();
  }

  onSubmit() {
    if (confirm('Bạn có chắc muốn submit nội dung này không?')) {
      this.submitPage.emit();
    }
  }

  onClearPage() {
    if (confirm('Bạn có chắc muốn xóa tất cả nội dung?')) {
      this.clearPage.emit();
    }
  }


}
