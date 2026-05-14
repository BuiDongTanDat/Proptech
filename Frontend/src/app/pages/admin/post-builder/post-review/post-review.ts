import { Component, input, output } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { Button } from '../../../../shared/components/ui/button/button';
import { PageBlock } from '../post-builder.type';

@Component({
  selector: 'app-post-review',
  imports: [
    LucideDynamicIcon,
    Button
  ],
  templateUrl: './post-review.html',
  styleUrl: './post-review.css',
})
export class PostReview {
  sections = input<PageBlock[]>([]);
  closePreview = output<void>();

  getGridTemplate(block: PageBlock): string {
    const cols = block.data.columns ?? [];
    if (cols.length === 0) return '1fr';
    return cols.map(c => `${c.widthRatio ?? 10}%`).join(' ');
  }
}
