import { Component, HostListener, input, output } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { Button } from '../ui/button/button';

@Component({
  selector: 'app-confirm-dialog',
  imports: [
    LucideDynamicIcon,
    Button
  ],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
    title = input<string>('');
  description = input<string>('');
  icon = input<string>('');
  show = input<boolean>(false);
  readonly titleClass = input<string>('text-gray-900');

  closed = output<void>();
  closeOnBackdrop = input<boolean>(true);
  
  close() {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.show()) {
      this.close();
    }
  }
}
