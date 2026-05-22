import { inject, Injectable, signal, computed } from '@angular/core';
import { IUserAccount } from '../models/model';
import { AuthService } from '../services/auth/auth.service';
import { ToastService } from '../services/toast/toast.service';

@Injectable({ providedIn: 'root' })
export class AuthStore {
    private authService = inject(AuthService);
    private toastService = inject(ToastService);

    // State
    readonly user = signal<IUserAccount | null>(this.authService.getUser());

    // Computed
    readonly isLoggedIn = computed(() => !!this.user());

    setUser(user: IUserAccount | null) {
        // 1. Cập nhật Signal để UI thay đổi ngay lập tức
        this.user.set(user);
        // 2. Lưu vào localStorage để khi F5 không mất dữ liệu
        this.authService.setUser(user);
    }

    logout() {
        this.user.set(null);
        this.authService.setUser(null);
        this.authService.logout();
        this.toastService.success('Đã đăng xuất thành công!');
    }
}