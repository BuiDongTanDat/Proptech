import {
  Component,
  HostListener,
  input,
  output,
} from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { Button } from "../ui/button/button";

@Component({
  selector: 'app-dialog',
  imports: [LucideDynamicIcon, Button],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
})
export class Dialog {
  title = input<string>('');
  description = input<string>('');
  icon = input<string>('');
  show = input<boolean>(false);

  closed = output<void>();
  closeOnBackdrop = input<boolean>(false);

  
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