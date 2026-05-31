import { Component, inject } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { ToastService, ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [LucideDynamicIcon],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class Toast {
  toastService = inject(ToastService);

  get toast() {
    return this.toastService.toast();
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
        bg: 'bg-red-50 text-red-800',
        icon: 'circle-alert',
      },
      warn: {
        bg: 'bg-yellow-50 text-yellow-800',
        icon: 'triangle-alert',
      },
    };

    return map[this.toast.type];
  }
}