import { Component, effect, input, signal } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';

export type ToastType = 'success' | 'error' | 'warn';

@Component({
  selector: 'app-toast',
  imports: [
    LucideDynamicIcon,
  ],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {

  visible = signal(false);
  message = signal('');
  type = signal<ToastType>('success');

  private timer: ReturnType<typeof setTimeout> | null = null;

  show(
    message: string,
    type: ToastType = 'success',
    duration = 3000
  ) {
    // reset timer cũ
    if (this.timer) {
      clearTimeout(this.timer);
    }

    // reset animation
    this.visible.set(false);

    setTimeout(() => {
      this.message.set(message);
      this.type.set(type);

      this.visible.set(true);

      this.timer = setTimeout(() => {
        this.visible.set(false);
      }, duration);
    });
  }

  get config() {
    const map: Record<
      ToastType,
      {
        bg: string;
        icon: string;
      }
    > = {
      success: {
        bg: 'bg-green-50 text-green-800',
        icon: 'check',
      },
      error: {
        bg: 'bg-red-50  text-red-800',
        icon: 'circle-alert',
      },
      warn: {
        bg: 'bg-yellow-50 text-yellow-800',
        icon: 'triangle-alert',
      },
    };

    return map[this.type()];
  }
}
