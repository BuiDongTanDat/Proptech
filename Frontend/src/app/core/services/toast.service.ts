import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warn';

export interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toast = signal<ToastState>({
    visible: false,
    message: '',
    type: 'success',
  });

  private timer: ReturnType<typeof setTimeout> | null = null;

  show(
    message: string,
    type: ToastType = 'success',
    duration = 3000
  ) {
    if (this.timer) clearTimeout(this.timer);

    // reset animation
    this.toast.set({
      visible: false,
      message: '',
      type,
    });

    setTimeout(() => {
      this.toast.set({
        visible: true,
        message,
        type,
      });

      this.timer = setTimeout(() => {
        this.toast.update((state) => ({
          ...state,
          visible: false,
        }));
      }, duration);
    });
  }

  success(message: string, duration = 3000) {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 3000) {
    this.show(message, 'error', duration);
  }

  warn(message: string, duration = 3000) {
    this.show(message, 'warn', duration);
  }
}